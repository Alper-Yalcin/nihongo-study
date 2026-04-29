from __future__ import annotations

import argparse
import gzip
import json
import xml.etree.ElementTree as ET
from pathlib import Path

from dictionary_common import (
    INTERMEDIATE_DIR,
    RAW_DIR,
    REPORTS_DIR,
    append_ndjson,
    build_word_record,
    classify_word_script,
    ensure_directories,
    preserve_unique,
    write_json,
)


XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"


def build_parse_error(
    *,
    source_id: str | None,
    error_type: str,
    message: str,
    context: dict | None = None,
) -> dict:
    return {
        "stage": "parse_jmdict",
        "source": "JMdict",
        "source_id": source_id,
        "error_type": error_type,
        "message": message,
        "context": context or {},
    }


def parse_priorities(parent: ET.Element, tag_name: str) -> list[str]:
    return preserve_unique(child.text for child in parent.findall(tag_name))


def parse_meanings(entry: ET.Element) -> list[str]:
    glosses: list[str] = []

    for sense in entry.findall("sense"):
        for gloss in sense.findall("gloss"):
            lang = gloss.attrib.get(XML_LANG) or gloss.attrib.get("lang")
            if lang not in (None, "eng"):
                continue
            if gloss.text:
                glosses.append(gloss.text)

    return preserve_unique(glosses)


def parse_kanji_forms(entry: ET.Element) -> list[dict[str, list[str] | str]]:
    forms: list[dict[str, list[str] | str]] = []

    for k_ele in entry.findall("k_ele"):
        text = k_ele.findtext("keb")
        if not text:
            continue
        forms.append({"text": text.strip(), "priority": parse_priorities(k_ele, "ke_pri")})

    return forms


def parse_reading_forms(entry: ET.Element) -> list[dict[str, list[str] | bool | str]]:
    forms: list[dict[str, list[str] | bool | str]] = []

    for r_ele in entry.findall("r_ele"):
        text = r_ele.findtext("reb")
        if not text:
            continue
        restrictions = preserve_unique(node.text for node in r_ele.findall("re_restr"))
        forms.append(
            {
                "text": text.strip(),
                "priority": parse_priorities(r_ele, "re_pri"),
                "restrictions": restrictions,
                "no_kanji": r_ele.find("re_nokanji") is not None,
            }
        )

    return forms


def build_pairs(
    kanji_forms: list[dict[str, list[str] | str]],
    reading_forms: list[dict[str, list[str] | bool | str]],
) -> list[tuple[str | None, str, list[str]]]:
    pairs: list[tuple[str | None, str, list[str]]] = []
    seen: set[tuple[str | None, str]] = set()

    if not kanji_forms:
        for reading in reading_forms:
            kana = str(reading["text"])
            key = (None, kana)
            if key in seen:
                continue
            seen.add(key)
            pairs.append((None, kana, preserve_unique(reading["priority"])))
        return pairs

    for reading in reading_forms:
        if reading["no_kanji"]:
            continue

        allowed = set(str(item) for item in reading["restrictions"]) or None
        reading_priority = list(str(item) for item in reading["priority"])
        kana = str(reading["text"])

        for kanji_form in kanji_forms:
            kanji = str(kanji_form["text"])
            if allowed is not None and kanji not in allowed:
                continue

            key = (kanji, kana)
            if key in seen:
                continue

            seen.add(key)
            pair_priority = preserve_unique(
                [*list(str(item) for item in kanji_form["priority"]), *reading_priority]
            )
            pairs.append((kanji, kana, pair_priority))

    return pairs


def parse_jmdict(input_path: Path, output_path: Path, parse_errors_path: Path, stats_path: Path) -> dict:
    ensure_directories(output_path.parent, parse_errors_path.parent, stats_path.parent)

    stats = {
        "total_entries_seen": 0,
        "total_records_written": 0,
        "parse_error_count": 0,
        "entries_without_meanings": 0,
        "entries_without_readings": 0,
        "entries_without_pairs": 0,
    }

    with (
        gzip.open(input_path, "rt", encoding="utf-8") as source_handle,
        output_path.open("w", encoding="utf-8", newline="\n") as output_handle,
        parse_errors_path.open("a", encoding="utf-8", newline="\n") as error_handle,
    ):
        context = ET.iterparse(source_handle, events=("end",))

        for _, element in context:
            if element.tag != "entry":
                continue

            stats["total_entries_seen"] += 1
            ent_seq = element.findtext("ent_seq")
            source_id = f"JMdict:{ent_seq}" if ent_seq else None

            try:
                if not ent_seq:
                    raise ValueError("Missing ent_seq")

                meanings = parse_meanings(element)
                if not meanings:
                    stats["entries_without_meanings"] += 1
                    append_ndjson(
                        build_parse_error(
                            source_id=source_id,
                            error_type="missing_meanings",
                            message="Entry has no English glosses.",
                        ),
                        error_handle,
                    )
                    stats["parse_error_count"] += 1
                    element.clear()
                    continue

                kanji_forms = parse_kanji_forms(element)
                reading_forms = parse_reading_forms(element)
                if not reading_forms:
                    stats["entries_without_readings"] += 1
                    append_ndjson(
                        build_parse_error(
                            source_id=source_id,
                            error_type="missing_readings",
                            message="Entry has no readable kana forms.",
                        ),
                        error_handle,
                    )
                    stats["parse_error_count"] += 1
                    element.clear()
                    continue

                pairs = build_pairs(kanji_forms, reading_forms)
                if not pairs:
                    stats["entries_without_pairs"] += 1
                    append_ndjson(
                        build_parse_error(
                            source_id=source_id,
                            error_type="missing_pairs",
                            message="Entry did not produce any valid kanji/kana pairs.",
                        ),
                        error_handle,
                    )
                    stats["parse_error_count"] += 1
                    element.clear()
                    continue

                for kanji, kana, priority in pairs:
                    script_type = classify_word_script(kanji, kana)
                    frequency = {"scheme": "jmdict_pri", "values": priority} if priority else None
                    record = build_word_record(
                        script_type=script_type,
                        kanji=kanji,
                        kana=kana,
                        meanings=meanings,
                        jlpt_level=None,
                        frequency=frequency,
                        source="JMdict",
                        source_id=source_id,
                    )
                    output_handle.write(json.dumps(record, ensure_ascii=False))
                    output_handle.write("\n")
                    stats["total_records_written"] += 1
            except Exception as error:
                append_ndjson(
                    build_parse_error(
                        source_id=source_id,
                        error_type="entry_parse_exception",
                        message=str(error),
                    ),
                    error_handle,
                )
                stats["parse_error_count"] += 1
            finally:
                element.clear()

    write_json(stats, stats_path)
    return stats


def main() -> int:
    parser = argparse.ArgumentParser(description="Parse JMdict into raw word NDJSON.")
    parser.add_argument(
        "--input",
        type=Path,
        default=RAW_DIR / "jmdict" / "JMdict_b.gz",
        help="Path to JMdict_b.gz or compatible JMdict XML gzip.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=INTERMEDIATE_DIR / "words.raw.ndjson",
        help="Destination for raw word records.",
    )
    parser.add_argument(
        "--parse-errors",
        type=Path,
        default=REPORTS_DIR / "parse_errors.ndjson",
        help="Shared parse error report path.",
    )
    parser.add_argument(
        "--stats-output",
        type=Path,
        default=INTERMEDIATE_DIR / "parse_jmdict.stats.json",
        help="JSON path for parser statistics.",
    )
    args = parser.parse_args()

    stats = parse_jmdict(args.input, args.output, args.parse_errors, args.stats_output)
    print(f"parsed_words={stats['total_records_written']}")
    print(f"parse_errors={stats['parse_error_count']}")
    print(f"output={args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

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
    build_kanji_character_record,
    ensure_directories,
    write_json,
)


def build_parse_error(
    *,
    source_id: str | None,
    error_type: str,
    message: str,
    context: dict | None = None,
) -> dict:
    return {
        "stage": "parse_kanjidic",
        "source": "KANJIDIC2",
        "source_id": source_id,
        "error_type": error_type,
        "message": message,
        "context": context or {},
    }


def english_meanings(character: ET.Element) -> list[str]:
    values: list[str] = []

    for meaning in character.findall("./reading_meaning/rmgroup/meaning"):
        lang = meaning.attrib.get("m_lang")
        if lang not in (None, "en"):
            continue
        if meaning.text:
            values.append(meaning.text.strip())

    return list(dict.fromkeys(value for value in values if value))


def readings(character: ET.Element, reading_type: str) -> list[str]:
    values: list[str] = []

    for reading in character.findall("./reading_meaning/rmgroup/reading"):
        if reading.attrib.get("r_type") != reading_type:
            continue
        if reading.text:
            values.append(reading.text.strip())

    return list(dict.fromkeys(value for value in values if value))


def parse_stroke_count(character: ET.Element) -> int | None:
    stroke_text = character.findtext("./misc/stroke_count")
    if not stroke_text:
        return None
    try:
        return int(stroke_text.strip())
    except ValueError:
        return None


def parse_frequency(character: ET.Element) -> dict[str, int] | None:
    frequency_text = character.findtext("./misc/freq")
    if not frequency_text:
        return None
    try:
        return {"scheme": "kanjidic_freq", "value": int(frequency_text.strip())}
    except ValueError:
        return None


def parse_legacy_jlpt(character: ET.Element) -> str | None:
    jlpt_text = character.findtext("./misc/jlpt")
    if not jlpt_text:
        return None
    return f"legacy:{jlpt_text.strip()}"


def parse_kanjidic(
    input_path: Path,
    output_path: Path,
    parse_errors_path: Path,
    stats_path: Path,
    use_legacy_jlpt: bool,
) -> dict:
    ensure_directories(output_path.parent, parse_errors_path.parent, stats_path.parent)

    stats = {
        "total_characters_seen": 0,
        "total_records_written": 0,
        "parse_error_count": 0,
        "characters_without_meanings": 0,
        "characters_without_literal": 0,
    }

    with (
        gzip.open(input_path, "rt", encoding="utf-8") as source_handle,
        output_path.open("w", encoding="utf-8", newline="\n") as output_handle,
        parse_errors_path.open("a", encoding="utf-8", newline="\n") as error_handle,
    ):
        context = ET.iterparse(source_handle, events=("end",))

        for _, element in context:
            if element.tag != "character":
                continue

            stats["total_characters_seen"] += 1
            literal = element.findtext("literal")
            source_id = f"KANJIDIC2:{literal.strip()}" if literal else None

            try:
                if not literal:
                    stats["characters_without_literal"] += 1
                    raise ValueError("Character is missing literal")

                meanings = english_meanings(element)
                if not meanings:
                    stats["characters_without_meanings"] += 1
                    append_ndjson(
                        build_parse_error(
                            source_id=source_id,
                            error_type="missing_meanings",
                            message="Character has no English meanings.",
                        ),
                        error_handle,
                    )
                    stats["parse_error_count"] += 1
                    element.clear()
                    continue

                record = build_kanji_character_record(
                    literal=literal.strip(),
                    meanings=meanings,
                    onyomi=readings(element, "ja_on"),
                    kunyomi=readings(element, "ja_kun"),
                    jlpt_level=parse_legacy_jlpt(element) if use_legacy_jlpt else None,
                    stroke_count=parse_stroke_count(element),
                    frequency=parse_frequency(element),
                    source="KANJIDIC2",
                    source_id=source_id,
                )

                output_handle.write(json.dumps(record, ensure_ascii=False))
                output_handle.write("\n")
                stats["total_records_written"] += 1
            except Exception as error:
                append_ndjson(
                    build_parse_error(
                        source_id=source_id,
                        error_type="character_parse_exception",
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
    parser = argparse.ArgumentParser(description="Parse KANJIDIC2 into raw kanji character NDJSON.")
    parser.add_argument(
        "--input",
        type=Path,
        default=RAW_DIR / "kanjidic2" / "kanjidic2.xml.gz",
        help="Path to kanjidic2.xml.gz.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=INTERMEDIATE_DIR / "kanji_characters.raw.ndjson",
        help="Destination for raw kanji character records.",
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
        default=INTERMEDIATE_DIR / "parse_kanjidic.stats.json",
        help="JSON path for parser statistics.",
    )
    parser.add_argument(
        "--use-legacy-jlpt",
        action="store_true",
        help="Keep KANJIDIC2 legacy JLPT 1-4 values in jlpt_level.",
    )
    args = parser.parse_args()

    stats = parse_kanjidic(
        args.input,
        args.output,
        args.parse_errors,
        args.stats_output,
        args.use_legacy_jlpt,
    )
    print(f"parsed_kanji_characters={stats['total_records_written']}")
    print(f"parse_errors={stats['parse_error_count']}")
    print(f"output={args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from dictionary_common import (
    INTERMEDIATE_DIR,
    JLPT_LEVEL_ORDER,
    RAW_DIR,
    REPORTS_DIR,
    append_ndjson,
    clean_text,
    ensure_directories,
    load_ndjson,
    normalize_match_text,
    normalize_surface_text,
    pick_easiest_jlpt,
    write_json,
)


def load_jlpt_word_indexes(
    jlpt_dir: Path,
) -> tuple[dict[tuple[str, str], set[str]], dict[tuple[str, str], set[str]], dict[str, set[str]]]:
    exact_pair_map: dict[tuple[str, str], set[str]] = {}
    normalized_pair_map: dict[tuple[str, str], set[str]] = {}
    kana_map: dict[str, set[str]] = {}

    for level in JLPT_LEVEL_ORDER:
        csv_path = jlpt_dir / f"{level.lower()}.csv"
        if not csv_path.exists():
            continue

        with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                expression_raw = row.get("expression")
                reading_raw = row.get("reading") or row.get("expression")
                expression = normalize_match_text(expression_raw)
                reading = normalize_match_text(reading_raw)
                normalized_expression = normalize_surface_text(expression_raw)
                normalized_reading = normalize_surface_text(reading_raw)

                if not expression or not reading:
                    continue

                exact_pair_map.setdefault((expression, reading), set()).add(level)
                normalized_pair_map.setdefault((normalized_expression, normalized_reading), set()).add(level)
                kana_map.setdefault(reading, set()).add(level)

    return exact_pair_map, normalized_pair_map, kana_map


def build_conflict_record(
    record: dict,
    strategy: str,
    match_key: str,
    candidate_levels: set[str],
    selected_level: str | None,
) -> dict:
    return {
        "record_id": record.get("id"),
        "source_id": record.get("source_id"),
        "script_type": record.get("script_type"),
        "kanji": record.get("kanji"),
        "kana": record.get("kana"),
        "match_strategy": strategy,
        "match_key": match_key,
        "candidate_levels": sorted(candidate_levels, key=lambda value: JLPT_LEVEL_ORDER.index(value)),
        "selected_level": selected_level,
    }


def build_unmatched_record(record: dict) -> dict:
    kanji = normalize_match_text(record.get("kanji"))
    kana = normalize_match_text(record.get("kana"))
    expression = kanji or kana
    return {
        "record_id": record.get("id"),
        "source_id": record.get("source_id"),
        "script_type": record.get("script_type"),
        "kanji": record.get("kanji"),
        "kana": record.get("kana"),
        "attempted_keys": {
            "exact_pair": [expression, kana],
            "normalized_pair": [normalize_surface_text(expression), normalize_surface_text(kana)],
            "kana_only": kana,
        },
    }


def resolve_word_jlpt(
    record: dict,
    exact_pair_map: dict[tuple[str, str], set[str]],
    normalized_pair_map: dict[tuple[str, str], set[str]],
    kana_map: dict[str, set[str]],
) -> tuple[str | None, str, set[str], str]:
    kanji = normalize_match_text(record.get("kanji"))
    kana = normalize_match_text(record.get("kana"))
    expression = kanji or kana

    if not expression or not kana:
        return None, "none", set(), ""

    exact_key = (expression, kana)
    exact_levels = exact_pair_map.get(exact_key)
    if exact_levels:
        return pick_easiest_jlpt(exact_levels), "exact_pair", exact_levels, f"{exact_key[0]}|{exact_key[1]}"

    normalized_key = (normalize_surface_text(expression), normalize_surface_text(kana))
    normalized_levels = normalized_pair_map.get(normalized_key)
    if normalized_levels:
        return (
            pick_easiest_jlpt(normalized_levels),
            "normalized_pair",
            normalized_levels,
            f"{normalized_key[0]}|{normalized_key[1]}",
        )

    kana_levels = kana_map.get(kana)
    if kana_levels:
        return pick_easiest_jlpt(kana_levels), "kana_only", kana_levels, kana

    return None, "none", set(), ""


def load_jlpt_kanji_index(csv_path: Path | None) -> dict[str, str]:
    if csv_path is None or not csv_path.exists():
        return {}

    result: dict[str, str] = {}

    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            literal = normalize_match_text(row.get("kanji") or row.get("literal"))
            level = clean_text(row.get("jlpt_level"))
            if literal and level:
                result[literal] = level

    return result


def merge_word_records(
    input_path: Path,
    output_path: Path,
    exact_pair_map: dict[tuple[str, str], set[str]],
    normalized_pair_map: dict[tuple[str, str], set[str]],
    kana_map: dict[str, set[str]],
    conflicts_path: Path,
    unmatched_path: Path,
) -> dict:
    stats = {
        "word_records_processed": 0,
        "jlpt_matched_count": 0,
        "jlpt_unmatched_count": 0,
        "exact_pair_match_count": 0,
        "normalized_pair_match_count": 0,
        "kana_only_match_count": 0,
        "fallback_match_count": 0,
        "conflict_count": 0,
    }

    ensure_directories(output_path.parent, conflicts_path.parent, unmatched_path.parent)

    with (
        output_path.open("w", encoding="utf-8", newline="\n") as output_handle,
        conflicts_path.open("w", encoding="utf-8", newline="\n") as conflict_handle,
        unmatched_path.open("w", encoding="utf-8", newline="\n") as unmatched_handle,
    ):
        for record in load_ndjson(input_path):
            stats["word_records_processed"] += 1
            level, strategy, candidate_levels, match_key = resolve_word_jlpt(
                record,
                exact_pair_map,
                normalized_pair_map,
                kana_map,
            )

            if level:
                record["jlpt_level"] = level
                record["source"] = "JMdict+JLPT"
                stats["jlpt_matched_count"] += 1

                if strategy == "exact_pair":
                    stats["exact_pair_match_count"] += 1
                elif strategy == "normalized_pair":
                    stats["normalized_pair_match_count"] += 1
                    stats["fallback_match_count"] += 1
                elif strategy == "kana_only":
                    stats["kana_only_match_count"] += 1
                    stats["fallback_match_count"] += 1

                if len(candidate_levels) > 1:
                    stats["conflict_count"] += 1
                    append_ndjson(
                        build_conflict_record(record, strategy, match_key, candidate_levels, level),
                        conflict_handle,
                    )
            else:
                stats["jlpt_unmatched_count"] += 1
                append_ndjson(build_unmatched_record(record), unmatched_handle)

            output_handle.write(json.dumps(record, ensure_ascii=False))
            output_handle.write("\n")

    return stats


def merge_kanji_records(
    input_path: Path | None,
    output_path: Path | None,
    jlpt_kanji_map: dict[str, str],
) -> dict:
    stats = {"kanji_jlpt_matched_count": 0, "kanji_records_processed": 0}
    if input_path is None or output_path is None or not input_path.exists():
        return stats

    ensure_directories(output_path.parent)
    with output_path.open("w", encoding="utf-8", newline="\n") as handle:
        for record in load_ndjson(input_path):
            stats["kanji_records_processed"] += 1
            literal = normalize_match_text(record.get("kanji"))
            level = jlpt_kanji_map.get(literal)
            if level:
                record["jlpt_level"] = level
                record["source"] = "KANJIDIC2+JLPT"
                stats["kanji_jlpt_matched_count"] += 1
            handle.write(json.dumps(record, ensure_ascii=False))
            handle.write("\n")

    return stats


def main() -> int:
    parser = argparse.ArgumentParser(description="Merge JLPT levels into normalized NDJSON records.")
    parser.add_argument(
        "--jlpt-dir",
        type=Path,
        default=RAW_DIR / "jlpt",
        help="Directory containing n5.csv ... n1.csv files.",
    )
    parser.add_argument(
        "--words-input",
        type=Path,
        default=INTERMEDIATE_DIR / "words.raw.ndjson",
        help="Input JMdict-derived word NDJSON.",
    )
    parser.add_argument(
        "--words-output",
        type=Path,
        default=INTERMEDIATE_DIR / "words.jlpt.ndjson",
        help="Output word NDJSON after JLPT merge.",
    )
    parser.add_argument(
        "--kanji-input",
        type=Path,
        default=INTERMEDIATE_DIR / "kanji_characters.raw.ndjson",
        help="Optional KANJIDIC2-derived kanji NDJSON input.",
    )
    parser.add_argument(
        "--kanji-output",
        type=Path,
        default=INTERMEDIATE_DIR / "kanji_characters.jlpt.ndjson",
        help="Optional kanji NDJSON output path.",
    )
    parser.add_argument(
        "--jlpt-kanji-csv",
        type=Path,
        default=None,
        help="Optional CSV with headers kanji,jlpt_level or literal,jlpt_level.",
    )
    parser.add_argument(
        "--conflicts-output",
        type=Path,
        default=REPORTS_DIR / "jlpt_conflicts.ndjson",
        help="Conflict report path.",
    )
    parser.add_argument(
        "--unmatched-output",
        type=Path,
        default=REPORTS_DIR / "jlpt_unmatched.ndjson",
        help="Unmatched JLPT report path.",
    )
    parser.add_argument(
        "--stats-output",
        type=Path,
        default=INTERMEDIATE_DIR / "merge_jlpt.stats.json",
        help="JSON path for merge statistics.",
    )
    args = parser.parse_args()

    exact_pair_map, normalized_pair_map, kana_map = load_jlpt_word_indexes(args.jlpt_dir)
    word_stats = merge_word_records(
        args.words_input,
        args.words_output,
        exact_pair_map,
        normalized_pair_map,
        kana_map,
        args.conflicts_output,
        args.unmatched_output,
    )

    jlpt_kanji_map = load_jlpt_kanji_index(args.jlpt_kanji_csv)
    kanji_stats = merge_kanji_records(args.kanji_input, args.kanji_output, jlpt_kanji_map)
    stats = {**word_stats, **kanji_stats}
    write_json(stats, args.stats_output)

    print(f"jlpt_matched={stats['jlpt_matched_count']}")
    print(f"jlpt_unmatched={stats['jlpt_unmatched_count']}")
    print(f"jlpt_conflicts={stats['conflict_count']}")
    print("jlpt_merge_complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

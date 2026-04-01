from __future__ import annotations

import argparse
import json
from pathlib import Path

from dictionary_common import (
    INTERMEDIATE_DIR,
    OUTPUT_DIR,
    REPORTS_DIR,
    VALID_JLPT_LEVELS,
    VALID_SCRIPT_TYPES,
    append_ndjson,
    count_ndjson,
    ensure_directories,
    load_ndjson,
    write_json,
)


def validation_error(record: dict, file_name: str, error_type: str, message: str) -> dict:
    return {
        "stage": "validate_normalized",
        "source": record.get("source"),
        "source_id": record.get("source_id"),
        "record_id": record.get("id"),
        "file": file_name,
        "error_type": error_type,
        "message": message,
    }


def validate_record(record: dict, file_name: str) -> list[dict]:
    errors: list[dict] = []
    script_type = record.get("script_type")
    meanings = record.get("meanings")
    kana = record.get("kana")
    kanji = record.get("kanji")
    romaji = record.get("romaji")
    jlpt_level = record.get("jlpt_level")

    if not script_type or script_type not in VALID_SCRIPT_TYPES:
        errors.append(validation_error(record, file_name, "invalid_script_type", "script_type is missing or invalid."))

    if not isinstance(meanings, list) or not meanings:
        errors.append(validation_error(record, file_name, "invalid_meanings", "meanings must be a non-empty array."))

    if script_type == "kanji_word" and (not isinstance(kana, str) or not kana.strip()):
        errors.append(validation_error(record, file_name, "missing_kana", "kanji_word records require non-empty kana."))

    if script_type == "kanji_character":
        if not isinstance(kanji, str) or len(kanji) != 1:
            errors.append(
                validation_error(record, file_name, "invalid_kanji_character", "kanji_character records must have a single-character kanji.")
            )

    if romaji is not None and not isinstance(romaji, str):
        errors.append(validation_error(record, file_name, "invalid_romaji", "romaji must be a string or null."))

    if jlpt_level is not None and jlpt_level not in VALID_JLPT_LEVELS:
        errors.append(
            validation_error(record, file_name, "invalid_jlpt_level", "jlpt_level must be one of N5/N4/N3/N2/N1/null.")
        )

    return errors


def validate_file(path: Path, parse_errors_path: Path) -> int:
    count = 0
    with parse_errors_path.open("a", encoding="utf-8", newline="\n") as error_handle:
        for record in load_ndjson(path):
            errors = validate_record(record, path.name)
            for error in errors:
                append_ndjson(error, error_handle)
                count += 1
    return count


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate normalized NDJSON outputs and build summary report.")
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR, help="Directory containing final NDJSON outputs.")
    parser.add_argument("--reports-dir", type=Path, default=REPORTS_DIR, help="Directory containing report outputs.")
    parser.add_argument(
        "--parse-errors",
        type=Path,
        default=REPORTS_DIR / "parse_errors.ndjson",
        help="Shared parse error report path.",
    )
    parser.add_argument(
        "--jlpt-stats",
        type=Path,
        default=INTERMEDIATE_DIR / "merge_jlpt.stats.json",
        help="Path to JLPT merge stats JSON.",
    )
    parser.add_argument(
        "--jmdict-stats",
        type=Path,
        default=INTERMEDIATE_DIR / "parse_jmdict.stats.json",
        help="Path to JMdict parser stats JSON.",
    )
    parser.add_argument(
        "--kanjidic-stats",
        type=Path,
        default=INTERMEDIATE_DIR / "parse_kanjidic.stats.json",
        help="Path to KANJIDIC2 parser stats JSON.",
    )
    parser.add_argument(
        "--summary-output",
        type=Path,
        default=REPORTS_DIR / "summary.json",
        help="Summary JSON report path.",
    )
    args = parser.parse_args()

    ensure_directories(args.reports_dir)

    hiragana_path = args.output_dir / "hiragana_words.ndjson"
    katakana_path = args.output_dir / "katakana_words.ndjson"
    kanji_words_path = args.output_dir / "kanji_words.ndjson"
    kanji_characters_path = args.output_dir / "kanji_characters.ndjson"

    validation_error_count = 0
    for path in (hiragana_path, katakana_path, kanji_words_path, kanji_characters_path):
        validation_error_count += validate_file(path, args.parse_errors)

    jlpt_stats = {}
    if args.jlpt_stats.exists():
        jlpt_stats = json.loads(args.jlpt_stats.read_text(encoding="utf-8"))

    jmdict_stats = {}
    if args.jmdict_stats.exists():
        jmdict_stats = json.loads(args.jmdict_stats.read_text(encoding="utf-8"))

    kanjidic_stats = {}
    if args.kanjidic_stats.exists():
        kanjidic_stats = json.loads(args.kanjidic_stats.read_text(encoding="utf-8"))

    summary = {
        "total_jmdict_word_records": jmdict_stats.get(
            "total_records_written",
            count_ndjson(hiragana_path) + count_ndjson(katakana_path) + count_ndjson(kanji_words_path),
        ),
        "total_kanji_character_records": kanjidic_stats.get(
            "total_records_written",
            count_ndjson(kanji_characters_path),
        ),
        "hiragana_word_count": count_ndjson(hiragana_path),
        "katakana_word_count": count_ndjson(katakana_path),
        "kanji_word_count": count_ndjson(kanji_words_path),
        "jlpt_matched_count": jlpt_stats.get("jlpt_matched_count", 0),
        "jlpt_unmatched_count": jlpt_stats.get("jlpt_unmatched_count", 0),
        "exact_pair_match_count": jlpt_stats.get("exact_pair_match_count", 0),
        "fallback_match_count": jlpt_stats.get("fallback_match_count", 0),
        "conflict_count": jlpt_stats.get("conflict_count", 0),
        "normalized_pair_match_count": jlpt_stats.get("normalized_pair_match_count", 0),
        "kana_only_match_count": jlpt_stats.get("kana_only_match_count", 0),
        "parse_error_count": count_ndjson(args.parse_errors),
        "validation_error_count": validation_error_count,
        "jmdict_entries_seen": jmdict_stats.get("total_entries_seen", 0),
        "kanjidic_characters_seen": kanjidic_stats.get("total_characters_seen", 0),
    }

    write_json(summary, args.summary_output)
    print(f"validation_errors={validation_error_count}")
    print(f"summary={args.summary_output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

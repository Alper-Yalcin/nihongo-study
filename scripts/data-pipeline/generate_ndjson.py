from __future__ import annotations

import argparse
import json
from pathlib import Path

from dictionary_common import INTERMEDIATE_DIR, OUTPUT_DIR, ensure_directories, load_ndjson


def main() -> int:
    parser = argparse.ArgumentParser(description="Split normalized records into final NDJSON files.")
    parser.add_argument(
        "--words-input",
        type=Path,
        default=INTERMEDIATE_DIR / "words.jlpt.ndjson",
        help="Input word NDJSON after JLPT merge.",
    )
    parser.add_argument(
        "--kanji-input",
        type=Path,
        default=INTERMEDIATE_DIR / "kanji_characters.jlpt.ndjson",
        help="Input kanji character NDJSON after optional JLPT merge.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=OUTPUT_DIR,
        help="Directory for final NDJSON files.",
    )
    args = parser.parse_args()

    ensure_directories(args.output_dir)
    output_paths = {
        "hiragana_word": args.output_dir / "hiragana_words.ndjson",
        "katakana_word": args.output_dir / "katakana_words.ndjson",
        "kanji_word": args.output_dir / "kanji_words.ndjson",
        "kanji_character": args.output_dir / "kanji_characters.ndjson",
    }
    counts = {key: 0 for key in output_paths}

    with (
        output_paths["hiragana_word"].open("w", encoding="utf-8", newline="\n") as hiragana_handle,
        output_paths["katakana_word"].open("w", encoding="utf-8", newline="\n") as katakana_handle,
        output_paths["kanji_word"].open("w", encoding="utf-8", newline="\n") as kanji_word_handle,
        output_paths["kanji_character"].open("w", encoding="utf-8", newline="\n") as kanji_character_handle,
    ):
        handles = {
            "hiragana_word": hiragana_handle,
            "katakana_word": katakana_handle,
            "kanji_word": kanji_word_handle,
            "kanji_character": kanji_character_handle,
        }

        for record in load_ndjson(args.words_input):
            script_type = record["script_type"]
            handles[script_type].write(json.dumps(record, ensure_ascii=False))
            handles[script_type].write("\n")
            counts[script_type] += 1

        kanji_input = args.kanji_input
        if not kanji_input.exists():
            fallback = INTERMEDIATE_DIR / "kanji_characters.raw.ndjson"
            kanji_input = fallback

        for record in load_ndjson(kanji_input):
            handles["kanji_character"].write(json.dumps(record, ensure_ascii=False))
            handles["kanji_character"].write("\n")
            counts["kanji_character"] += 1

    print(f"output_counts={counts}")
    for script_type, path in output_paths.items():
        print(f"{script_type}={path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

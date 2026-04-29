from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from dictionary_common import INTERMEDIATE_DIR, OUTPUT_DIR, RAW_DIR, REPORTS_DIR, ROOT, ensure_directories, reset_path


SCRIPT_DIR = Path(__file__).resolve().parent


def run(script_name: str, *args: str) -> None:
    command = [sys.executable, str(SCRIPT_DIR / script_name), *args]
    print("run", " ".join(command))
    subprocess.run(command, check=True, cwd=ROOT)


def prepare_outputs(intermediate_dir: Path, output_dir: Path, reports_dir: Path) -> None:
    ensure_directories(intermediate_dir, output_dir, reports_dir)
    for target in (
        output_dir,
        reports_dir / "summary.json",
        reports_dir / "jlpt_conflicts.ndjson",
        reports_dir / "jlpt_unmatched.ndjson",
        reports_dir / "parse_errors.ndjson",
    ):
        reset_path(target)
    ensure_directories(output_dir, reports_dir)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build normalized dictionary NDJSON outputs.")
    parser.add_argument("--skip-download", action="store_true", help="Use existing raw source files.")
    parser.add_argument(
        "--use-legacy-kanjidic-jlpt",
        action="store_true",
        help="Keep KANJIDIC2 legacy JLPT 1-4 values on kanji characters.",
    )
    parser.add_argument(
        "--jlpt-kanji-csv",
        default=None,
        help="Optional CSV overlay with kanji,jlpt_level for kanji characters.",
    )
    parser.add_argument("--raw-dir", type=Path, default=RAW_DIR, help="Raw source directory root.")
    parser.add_argument(
        "--intermediate-dir",
        type=Path,
        default=INTERMEDIATE_DIR,
        help="Intermediate working directory root.",
    )
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR, help="Directory for final NDJSON files.")
    parser.add_argument("--reports-dir", type=Path, default=REPORTS_DIR, help="Directory for report files.")
    args = parser.parse_args()

    prepare_outputs(args.intermediate_dir, args.output_dir, args.reports_dir)

    if not args.skip_download:
        run("download_sources.py", "--raw-dir", str(args.raw_dir))

    parse_kanjidic_args: list[str] = []
    if args.use_legacy_kanjidic_jlpt:
        parse_kanjidic_args.append("--use-legacy-jlpt")

    parse_errors_path = args.reports_dir / "parse_errors.ndjson"
    conflicts_path = args.reports_dir / "jlpt_conflicts.ndjson"
    unmatched_path = args.reports_dir / "jlpt_unmatched.ndjson"
    summary_path = args.reports_dir / "summary.json"

    jmdict_output = args.intermediate_dir / "words.raw.ndjson"
    jmdict_stats = args.intermediate_dir / "parse_jmdict.stats.json"
    kanjidic_output = args.intermediate_dir / "kanji_characters.raw.ndjson"
    kanjidic_stats = args.intermediate_dir / "parse_kanjidic.stats.json"
    merged_words_output = args.intermediate_dir / "words.jlpt.ndjson"
    merged_kanji_output = args.intermediate_dir / "kanji_characters.jlpt.ndjson"
    jlpt_stats = args.intermediate_dir / "merge_jlpt.stats.json"

    run(
        "parse_jmdict.py",
        "--input",
        str(args.raw_dir / "jmdict" / "JMdict_b.gz"),
        "--output",
        str(jmdict_output),
        "--parse-errors",
        str(parse_errors_path),
        "--stats-output",
        str(jmdict_stats),
    )

    run(
        "parse_kanjidic.py",
        "--input",
        str(args.raw_dir / "kanjidic2" / "kanjidic2.xml.gz"),
        "--output",
        str(kanjidic_output),
        "--parse-errors",
        str(parse_errors_path),
        "--stats-output",
        str(kanjidic_stats),
        *parse_kanjidic_args,
    )

    merge_args: list[str] = [
        "--jlpt-dir",
        str(args.raw_dir / "jlpt"),
        "--words-input",
        str(jmdict_output),
        "--words-output",
        str(merged_words_output),
        "--kanji-input",
        str(kanjidic_output),
        "--kanji-output",
        str(merged_kanji_output),
        "--conflicts-output",
        str(conflicts_path),
        "--unmatched-output",
        str(unmatched_path),
        "--stats-output",
        str(jlpt_stats),
    ]
    if args.jlpt_kanji_csv:
        merge_args.extend(["--jlpt-kanji-csv", args.jlpt_kanji_csv])
    run("merge_jlpt.py", *merge_args)

    run(
        "generate_ndjson.py",
        "--words-input",
        str(merged_words_output),
        "--kanji-input",
        str(merged_kanji_output),
        "--output-dir",
        str(args.output_dir),
    )

    run(
        "validate_normalized.py",
        "--output-dir",
        str(args.output_dir),
        "--reports-dir",
        str(args.reports_dir),
        "--parse-errors",
        str(parse_errors_path),
        "--jlpt-stats",
        str(jlpt_stats),
        "--jmdict-stats",
        str(jmdict_stats),
        "--kanjidic-stats",
        str(kanjidic_stats),
        "--summary-output",
        str(summary_path),
    )

    print("normalized_dictionary_build_complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

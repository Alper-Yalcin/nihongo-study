from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from dictionary_common import FIXTURES_DIR, ROOT


SCRIPT_DIR = Path(__file__).resolve().parent


def run(*args: str) -> None:
    command = [sys.executable, *args]
    print("run", " ".join(command))
    subprocess.run(command, check=True, cwd=ROOT)


def compare_text(actual: Path, expected: Path) -> None:
    actual_text = actual.read_text(encoding="utf-8")
    expected_text = expected.read_text(encoding="utf-8")
    if actual_text != expected_text:
        raise AssertionError(f"Mismatch: {actual} != {expected}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run normalized dictionary pipeline against local fixtures.")
    parser.add_argument(
        "--fixture-dir",
        type=Path,
        default=FIXTURES_DIR / "baseline",
        help="Fixture directory root.",
    )
    args = parser.parse_args()

    raw_dir = args.fixture_dir / "raw"
    intermediate_dir = args.fixture_dir / "intermediate"
    output_dir = args.fixture_dir / "normalized"
    reports_dir = args.fixture_dir / "reports"
    expected_dir = args.fixture_dir / "expected"

    run(str(SCRIPT_DIR / "create_fixture_data.py"), "--fixture-dir", str(args.fixture_dir))
    run(
        str(SCRIPT_DIR / "build_normalized_dictionary.py"),
        "--skip-download",
        "--raw-dir",
        str(raw_dir),
        "--intermediate-dir",
        str(intermediate_dir),
        "--output-dir",
        str(output_dir),
        "--reports-dir",
        str(reports_dir),
    )

    compare_text(output_dir / "hiragana_words.ndjson", expected_dir / "hiragana_words.ndjson")
    compare_text(output_dir / "katakana_words.ndjson", expected_dir / "katakana_words.ndjson")
    compare_text(output_dir / "kanji_words.ndjson", expected_dir / "kanji_words.ndjson")
    compare_text(output_dir / "kanji_characters.ndjson", expected_dir / "kanji_characters.ndjson")
    compare_text(reports_dir / "summary.json", expected_dir / "summary.json")

    print("fixture_pipeline_ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

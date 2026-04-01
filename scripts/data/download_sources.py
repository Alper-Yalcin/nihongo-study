from __future__ import annotations

import argparse
import shutil
import urllib.request
from pathlib import Path

from dictionary_common import RAW_DIR, ensure_directories


SOURCE_URLS = {
    "jmdict_b": "http://ftp.edrdg.org/pub/Nihongo/JMdict_b.gz",
    "kanjidic2": "http://www.edrdg.org/kanjidic/kanjidic2.xml.gz",
    "jlpt_n5": "https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n5.csv",
    "jlpt_n4": "https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n4.csv",
    "jlpt_n3": "https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n3.csv",
    "jlpt_n2": "https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n2.csv",
    "jlpt_n1": "https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n1.csv",
}


def download(url: str, destination: Path, force: bool) -> None:
    if destination.exists() and not force:
        print(f"skip {destination}")
        return

    ensure_directories(destination.parent)
    print(f"download {url} -> {destination}")

    with urllib.request.urlopen(url) as response, destination.open("wb") as handle:
        shutil.copyfileobj(response, handle)


def main() -> int:
    parser = argparse.ArgumentParser(description="Download raw dictionary sources.")
    parser.add_argument("--force", action="store_true", help="Redownload existing files.")
    parser.add_argument(
        "--raw-dir",
        type=Path,
        default=RAW_DIR,
        help="Destination root for raw source files.",
    )
    args = parser.parse_args()

    targets = {
        "jmdict_b": args.raw_dir / "jmdict" / "JMdict_b.gz",
        "kanjidic2": args.raw_dir / "kanjidic2" / "kanjidic2.xml.gz",
        "jlpt_n5": args.raw_dir / "jlpt" / "n5.csv",
        "jlpt_n4": args.raw_dir / "jlpt" / "n4.csv",
        "jlpt_n3": args.raw_dir / "jlpt" / "n3.csv",
        "jlpt_n2": args.raw_dir / "jlpt" / "n2.csv",
        "jlpt_n1": args.raw_dir / "jlpt" / "n1.csv",
    }

    for key, destination in targets.items():
        download(SOURCE_URLS[key], destination, args.force)

    print("download_complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

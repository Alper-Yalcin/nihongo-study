#!/usr/bin/env python3
"""Generate kana audio files via Google Translate TTS (gTTS)."""

from __future__ import annotations

import argparse
import json
import re
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from gtts import gTTS


FILENAME_OVERRIDES = {
    "dji": "ji2",
    "dzu": "zu2",
}


@dataclass(frozen=True)
class KanaEntry:
    id: str
    symbol: str


def parse_kana_entries(kana_file: Path, script: str) -> list[KanaEntry]:
    source = kana_file.read_text(encoding="utf-8")
    unique_entries: dict[str, KanaEntry] = {}
    entry_re = re.compile(
        rf"\{{\s*id:\s*['\"](?P<id>{script}-[^'\"]+)['\"]\s*,\s*symbol:\s*['\"](?P<symbol>[^'\"]+)['\"]",
        re.MULTILINE,
    )

    for match in entry_re.finditer(source):
        entry = KanaEntry(id=match.group("id"), symbol=match.group("symbol"))
        if entry.id not in unique_entries:
            unique_entries[entry.id] = entry

    if not unique_entries:
        raise RuntimeError(f"No '{script}' entries found in: {kana_file}")

    return list(unique_entries.values())


def to_output_filename(entry_id: str) -> str:
    if len(entry_id) > 2 and entry_id[1] == "-" and entry_id[0] in {"h", "k"}:
        base_name = entry_id[2:]
    else:
        base_name = entry_id
    return f"{FILENAME_OVERRIDES.get(base_name, base_name)}.mp3"


def synthesize_to_mp3(symbol: str, output_path: Path, retries: int, delay_seconds: float) -> None:
    for attempt in range(1, retries + 1):
        try:
            gTTS(text=symbol, lang="ja", tld="co.jp").save(str(output_path))
            return
        except Exception as exc:  # noqa: BLE001
            if attempt == retries:
                raise RuntimeError(f"Failed for '{symbol}' after {retries} attempts") from exc
            time.sleep(delay_seconds * attempt)


def build_manifest_record(repo_root: Path, entry: KanaEntry, output_path: Path, status: str) -> dict[str, str]:
    return {
        "id": entry.id,
        "symbol": entry.symbol,
        "filename": output_path.name,
        "path": output_path.relative_to(repo_root).as_posix(),
        "status": status,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate kana audio files from Google Translate TTS.",
    )
    parser.add_argument(
        "--script",
        choices=["h", "k"],
        default="h",
        help="Kana script prefix: h=hiragana, k=katakana.",
    )
    parser.add_argument(
        "--kana-file",
        default="Frontend/src/data/kana.ts",
        help="Relative path to kana TypeScript source file.",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Relative output directory for generated mp3 files.",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="Retry count per character if request fails.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.35,
        help="Base delay (seconds) used between retries.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing mp3 files if they already exist.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    kana_file = (repo_root / args.kana_file).resolve()
    script_name = "hiragana" if args.script == "h" else "katakana"
    output_dir_relative = args.output_dir or f"public/sounds/google-translate/{script_name}"
    output_dir = (repo_root / output_dir_relative).resolve()

    entries = parse_kana_entries(kana_file, args.script)
    output_dir.mkdir(parents=True, exist_ok=True)

    generated = 0
    skipped = 0
    manifest_records: list[dict[str, str]] = []

    total = len(entries)
    for index, entry in enumerate(entries, start=1):
        output_path = output_dir / to_output_filename(entry.id)

        if output_path.exists() and not args.force:
            skipped += 1
            status = "skipped"
        else:
            synthesize_to_mp3(
                symbol=entry.symbol,
                output_path=output_path,
                retries=args.retries,
                delay_seconds=args.delay,
            )
            generated += 1
            status = "generated"

        manifest_records.append(
            build_manifest_record(
                repo_root=repo_root,
                entry=entry,
                output_path=output_path,
                status=status,
            )
        )
        print(
            f"[{index:>3}/{total}] {entry.id:<8} {entry.symbol} -> "
            f"{output_path.relative_to(repo_root).as_posix()} ({status})"
        )

    manifest_path = output_dir / "manifest.json"
    manifest = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "google-translate-gtts",
        "language": "ja",
        "script": script_name,
        "total": total,
        "generated": generated,
        "skipped": skipped,
        "items": manifest_records,
    }
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print()
    print(f"Done. total={total}, generated={generated}, skipped={skipped}")
    print(f"Manifest: {manifest_path.relative_to(repo_root).as_posix()}")


if __name__ == "__main__":
    main()

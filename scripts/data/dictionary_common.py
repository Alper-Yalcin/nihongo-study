from __future__ import annotations

import hashlib
import json
import shutil
import sys
import unicodedata
from pathlib import Path
from typing import Any, Iterable, Iterator


ROOT = Path(__file__).resolve().parents[2]
SCRIPTS_DIR = ROOT / "scripts"
RAW_DIR = ROOT / "data-sources" / "raw"
INTERMEDIATE_DIR = ROOT / "data-sources" / "intermediate"
OUTPUT_DIR = ROOT / "data-sources" / "normalized"
REPORTS_DIR = ROOT / "reports"
FIXTURES_DIR = ROOT / "data-sources" / "fixtures"
JLPT_LEVEL_ORDER = ["N5", "N4", "N3", "N2", "N1"]
JLPT_LEVEL_RANK = {level: index for index, level in enumerate(JLPT_LEVEL_ORDER)}
VALID_JLPT_LEVELS = set(JLPT_LEVEL_ORDER)
WORD_SCRIPT_TYPES = {"hiragana_word", "katakana_word", "kanji_word"}
VALID_SCRIPT_TYPES = {*WORD_SCRIPT_TYPES, "kanji_character"}

if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from fill_romaji import transliterate  # noqa: E402


def ensure_directories(*paths: Path) -> None:
    for path in paths:
        path.mkdir(parents=True, exist_ok=True)


def reset_path(path: Path) -> None:
    if path.is_dir():
        shutil.rmtree(path)
    elif path.exists():
        path.unlink()


def stable_id(*parts: str | None, length: int = 16) -> str:
    joined = "\x1f".join("" if part is None else part for part in parts)
    digest = hashlib.sha1(joined.encode("utf-8")).hexdigest()
    return digest[:length]


def write_json(data: Any, path: Path) -> None:
    ensure_directories(path.parent)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def write_ndjson(records: Iterable[dict[str, Any]], path: Path) -> int:
    ensure_directories(path.parent)
    count = 0

    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for record in records:
            append_ndjson(record, handle)
            count += 1

    return count


def append_ndjson(record: dict[str, Any], handle: Any) -> None:
    handle.write(json.dumps(record, ensure_ascii=False))
    handle.write("\n")


def load_ndjson(path: Path) -> Iterator[dict[str, Any]]:
    if not path.exists():
        return
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                yield json.loads(line)


def count_ndjson(path: Path) -> int:
    if not path.exists():
        return 0
    with path.open("r", encoding="utf-8") as handle:
        return sum(1 for line in handle if line.strip())


def preserve_unique(values: Iterable[str | None]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []

    for value in values:
        if value is None:
            continue
        text = value.strip()
        if not text or text in seen:
            continue
        seen.add(text)
        result.append(text)

    return result


def clean_text(value: str | None) -> str | None:
    if value is None:
        return None
    text = value.strip()
    return text or None


def normalize_match_text(value: str | None) -> str:
    if value is None:
        return ""
    return unicodedata.normalize("NFKC", value).strip()


def normalize_surface_text(value: str | None) -> str:
    normalized = normalize_match_text(value)
    if not normalized:
        return ""

    removable = {
        " ",
        "　",
        "〜",
        "～",
        "~",
        "・",
        "･",
        "／",
        "/",
        "−",
        "-",
        "―",
        "‐",
        "‑",
    }
    return "".join(char for char in normalized if char not in removable)


def jlpt_sort_key(level: str) -> int:
    return JLPT_LEVEL_RANK.get(level, len(JLPT_LEVEL_ORDER))


def pick_easiest_jlpt(levels: Iterable[str]) -> str | None:
    normalized = [level for level in preserve_unique(levels) if level in VALID_JLPT_LEVELS]
    if not normalized:
        return None
    return min(normalized, key=jlpt_sort_key)


def is_hiragana(char: str) -> bool:
    codepoint = ord(char)
    return 0x3040 <= codepoint <= 0x309F


def is_katakana(char: str) -> bool:
    codepoint = ord(char)
    return (
        0x30A0 <= codepoint <= 0x30FF
        or 0x31F0 <= codepoint <= 0x31FF
        or 0xFF66 <= codepoint <= 0xFF9F
    )


def is_kanji_char(char: str) -> bool:
    codepoint = ord(char)
    return (
        0x3400 <= codepoint <= 0x4DBF
        or 0x4E00 <= codepoint <= 0x9FFF
        or 0xF900 <= codepoint <= 0xFAFF
        or 0x20000 <= codepoint <= 0x2A6DF
        or 0x2A700 <= codepoint <= 0x2B73F
        or 0x2B740 <= codepoint <= 0x2B81F
        or 0x2B820 <= codepoint <= 0x2CEAF
        or 0x2CEB0 <= codepoint <= 0x2EBEF
        or 0x30000 <= codepoint <= 0x3134F
    )


def contains_kanji(text: str | None) -> bool:
    return bool(text) and any(is_kanji_char(char) for char in text)


def contains_katakana(text: str | None) -> bool:
    return bool(text) and any(is_katakana(char) for char in text)


def extract_kanji_components(text: str | None) -> list[str]:
    if not text:
        return []

    components: list[str] = []
    seen: set[str] = set()
    previous_kanji: str | None = None

    for char in text:
        component: str | None = None

        if char == "々" and previous_kanji is not None:
            component = previous_kanji
        elif is_kanji_char(char):
            component = char
            previous_kanji = char
        else:
            previous_kanji = None

        if component and component not in seen:
            seen.add(component)
            components.append(component)

    return components


def classify_word_script(kanji: str | None, kana: str | None) -> str:
    if clean_text(kanji):
        return "kanji_word"
    if contains_katakana(kana):
        return "katakana_word"
    return "hiragana_word"


def romanize(kana: str | None) -> str | None:
    if kana is None:
        return None
    text = kana.strip()
    if not text:
        return None
    return transliterate(text)


def build_word_record(
    *,
    script_type: str,
    kanji: str | None,
    kana: str | None,
    meanings: list[str],
    jlpt_level: str | None,
    frequency: dict[str, Any] | None,
    source: str,
    source_id: str,
) -> dict[str, Any]:
    normalized_kanji = clean_text(kanji)
    normalized_kana = clean_text(kana)
    return {
        "id": stable_id(script_type, source_id, normalized_kanji, normalized_kana),
        "script_type": script_type,
        "kanji": normalized_kanji,
        "kana": normalized_kana,
        "romaji": romanize(normalized_kana),
        "meanings": preserve_unique(meanings),
        "jlpt_level": jlpt_level,
        "kanji_components": extract_kanji_components(normalized_kanji),
        "onyomi": [],
        "kunyomi": [],
        "stroke_count": None,
        "frequency": frequency,
        "source": source,
        "source_id": source_id,
    }


def build_kanji_character_record(
    *,
    literal: str,
    meanings: list[str],
    onyomi: list[str],
    kunyomi: list[str],
    jlpt_level: str | None,
    stroke_count: int | None,
    frequency: dict[str, Any] | None,
    source: str,
    source_id: str,
) -> dict[str, Any]:
    return {
        "id": stable_id("kanji_character", source_id, literal),
        "script_type": "kanji_character",
        "kanji": literal,
        "kana": None,
        "romaji": None,
        "meanings": preserve_unique(meanings),
        "jlpt_level": jlpt_level,
        "kanji_components": [],
        "onyomi": preserve_unique(onyomi),
        "kunyomi": preserve_unique(kunyomi),
        "stroke_count": stroke_count,
        "frequency": frequency,
        "source": source,
        "source_id": source_id,
    }

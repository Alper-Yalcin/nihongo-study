from __future__ import annotations

import argparse
import codecs
import csv
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]


def u(value: str) -> str:
    return value.encode("ascii").decode("unicode_escape")


def build_map(pairs: dict[str, str]) -> dict[str, str]:
    return {u(key): value for key, value in pairs.items()}


SINGLE_ROMAJI = build_map(
    {
        r"\u3042": "a",
        r"\u3044": "i",
        r"\u3046": "u",
        r"\u3048": "e",
        r"\u304a": "o",
        r"\u304b": "ka",
        r"\u304d": "ki",
        r"\u304f": "ku",
        r"\u3051": "ke",
        r"\u3053": "ko",
        r"\u3055": "sa",
        r"\u3057": "shi",
        r"\u3059": "su",
        r"\u305b": "se",
        r"\u305d": "so",
        r"\u305f": "ta",
        r"\u3061": "chi",
        r"\u3064": "tsu",
        r"\u3066": "te",
        r"\u3068": "to",
        r"\u306a": "na",
        r"\u306b": "ni",
        r"\u306c": "nu",
        r"\u306d": "ne",
        r"\u306e": "no",
        r"\u306f": "ha",
        r"\u3072": "hi",
        r"\u3075": "fu",
        r"\u3078": "he",
        r"\u307b": "ho",
        r"\u307e": "ma",
        r"\u307f": "mi",
        r"\u3080": "mu",
        r"\u3081": "me",
        r"\u3082": "mo",
        r"\u3084": "ya",
        r"\u3086": "yu",
        r"\u3088": "yo",
        r"\u3089": "ra",
        r"\u308a": "ri",
        r"\u308b": "ru",
        r"\u308c": "re",
        r"\u308d": "ro",
        r"\u308f": "wa",
        r"\u3092": "wo",
        r"\u3093": "n",
        r"\u304c": "ga",
        r"\u304e": "gi",
        r"\u3050": "gu",
        r"\u3052": "ge",
        r"\u3054": "go",
        r"\u3056": "za",
        r"\u3058": "ji",
        r"\u305a": "zu",
        r"\u305c": "ze",
        r"\u305e": "zo",
        r"\u3060": "da",
        r"\u3062": "ji",
        r"\u3065": "zu",
        r"\u3067": "de",
        r"\u3069": "do",
        r"\u3070": "ba",
        r"\u3073": "bi",
        r"\u3076": "bu",
        r"\u3079": "be",
        r"\u307c": "bo",
        r"\u3071": "pa",
        r"\u3074": "pi",
        r"\u3077": "pu",
        r"\u307a": "pe",
        r"\u307d": "po",
        r"\u3041": "a",
        r"\u3043": "i",
        r"\u3045": "u",
        r"\u3047": "e",
        r"\u3049": "o",
        r"\u308e": "wa",
        r"\u3094": "vu",
        r"\u3095": "ka",
        r"\u3096": "ke",
        r"\u30a2": "a",
        r"\u30a4": "i",
        r"\u30a6": "u",
        r"\u30a8": "e",
        r"\u30aa": "o",
        r"\u30ab": "ka",
        r"\u30ad": "ki",
        r"\u30af": "ku",
        r"\u30b1": "ke",
        r"\u30b3": "ko",
        r"\u30b5": "sa",
        r"\u30b7": "shi",
        r"\u30b9": "su",
        r"\u30bb": "se",
        r"\u30bd": "so",
        r"\u30bf": "ta",
        r"\u30c1": "chi",
        r"\u30c4": "tsu",
        r"\u30c6": "te",
        r"\u30c8": "to",
        r"\u30ca": "na",
        r"\u30cb": "ni",
        r"\u30cc": "nu",
        r"\u30cd": "ne",
        r"\u30ce": "no",
        r"\u30cf": "ha",
        r"\u30d2": "hi",
        r"\u30d5": "fu",
        r"\u30d8": "he",
        r"\u30db": "ho",
        r"\u30de": "ma",
        r"\u30df": "mi",
        r"\u30e0": "mu",
        r"\u30e1": "me",
        r"\u30e2": "mo",
        r"\u30e4": "ya",
        r"\u30e6": "yu",
        r"\u30e8": "yo",
        r"\u30e9": "ra",
        r"\u30ea": "ri",
        r"\u30eb": "ru",
        r"\u30ec": "re",
        r"\u30ed": "ro",
        r"\u30ef": "wa",
        r"\u30f2": "wo",
        r"\u30f3": "n",
        r"\u30ac": "ga",
        r"\u30ae": "gi",
        r"\u30b0": "gu",
        r"\u30b2": "ge",
        r"\u30b4": "go",
        r"\u30b6": "za",
        r"\u30b8": "ji",
        r"\u30ba": "zu",
        r"\u30bc": "ze",
        r"\u30be": "zo",
        r"\u30c0": "da",
        r"\u30c2": "ji",
        r"\u30c5": "zu",
        r"\u30c7": "de",
        r"\u30c9": "do",
        r"\u30d0": "ba",
        r"\u30d3": "bi",
        r"\u30d6": "bu",
        r"\u30d9": "be",
        r"\u30dc": "bo",
        r"\u30d1": "pa",
        r"\u30d4": "pi",
        r"\u30d7": "pu",
        r"\u30da": "pe",
        r"\u30dd": "po",
        r"\u30a1": "a",
        r"\u30a3": "i",
        r"\u30a5": "u",
        r"\u30a7": "e",
        r"\u30a9": "o",
        r"\u30ee": "wa",
        r"\u30f4": "vu",
        r"\u30f5": "ka",
        r"\u30f6": "ke",
    }
)

COMBO_ROMAJI = build_map(
    {
        r"\u304d\u3083": "kya",
        r"\u304d\u3085": "kyu",
        r"\u304d\u3087": "kyo",
        r"\u304e\u3083": "gya",
        r"\u304e\u3085": "gyu",
        r"\u304e\u3087": "gyo",
        r"\u3057\u3083": "sha",
        r"\u3057\u3085": "shu",
        r"\u3057\u3087": "sho",
        r"\u3058\u3083": "ja",
        r"\u3058\u3085": "ju",
        r"\u3058\u3087": "jo",
        r"\u3062\u3083": "ja",
        r"\u3062\u3085": "ju",
        r"\u3062\u3087": "jo",
        r"\u3061\u3083": "cha",
        r"\u3061\u3085": "chu",
        r"\u3061\u3087": "cho",
        r"\u306b\u3083": "nya",
        r"\u306b\u3085": "nyu",
        r"\u306b\u3087": "nyo",
        r"\u3072\u3083": "hya",
        r"\u3072\u3085": "hyu",
        r"\u3072\u3087": "hyo",
        r"\u3073\u3083": "bya",
        r"\u3073\u3085": "byu",
        r"\u3073\u3087": "byo",
        r"\u3074\u3083": "pya",
        r"\u3074\u3085": "pyu",
        r"\u3074\u3087": "pyo",
        r"\u307f\u3083": "mya",
        r"\u307f\u3085": "myu",
        r"\u307f\u3087": "myo",
        r"\u308a\u3083": "rya",
        r"\u308a\u3085": "ryu",
        r"\u308a\u3087": "ryo",
        r"\u30ad\u30e3": "kya",
        r"\u30ad\u30e5": "kyu",
        r"\u30ad\u30e7": "kyo",
        r"\u30ae\u30e3": "gya",
        r"\u30ae\u30e5": "gyu",
        r"\u30ae\u30e7": "gyo",
        r"\u30b7\u30e3": "sha",
        r"\u30b7\u30e5": "shu",
        r"\u30b7\u30e7": "sho",
        r"\u30b8\u30e3": "ja",
        r"\u30b8\u30e5": "ju",
        r"\u30b8\u30e7": "jo",
        r"\u30c2\u30e3": "ja",
        r"\u30c2\u30e5": "ju",
        r"\u30c2\u30e7": "jo",
        r"\u30c1\u30e3": "cha",
        r"\u30c1\u30e5": "chu",
        r"\u30c1\u30e7": "cho",
        r"\u30cb\u30e3": "nya",
        r"\u30cb\u30e5": "nyu",
        r"\u30cb\u30e7": "nyo",
        r"\u30d2\u30e3": "hya",
        r"\u30d2\u30e5": "hyu",
        r"\u30d2\u30e7": "hyo",
        r"\u30d3\u30e3": "bya",
        r"\u30d3\u30e5": "byu",
        r"\u30d3\u30e7": "byo",
        r"\u30d4\u30e3": "pya",
        r"\u30d4\u30e5": "pyu",
        r"\u30d4\u30e7": "pyo",
        r"\u30df\u30e3": "mya",
        r"\u30df\u30e5": "myu",
        r"\u30df\u30e7": "myo",
        r"\u30ea\u30e3": "rya",
        r"\u30ea\u30e5": "ryu",
        r"\u30ea\u30e7": "ryo",
        r"\u30b7\u30a7": "she",
        r"\u30b8\u30a7": "je",
        r"\u30c1\u30a7": "che",
        r"\u30c6\u30a3": "ti",
        r"\u30c8\u30a5": "tu",
        r"\u30c7\u30a3": "di",
        r"\u30c9\u30a5": "du",
        r"\u30c4\u30a1": "tsa",
        r"\u30c4\u30a3": "tsi",
        r"\u30c4\u30a7": "tse",
        r"\u30c4\u30a9": "tso",
        r"\u30d5\u30a1": "fa",
        r"\u30d5\u30a3": "fi",
        r"\u30d5\u30a7": "fe",
        r"\u30d5\u30a9": "fo",
        r"\u30d5\u30e5": "fyu",
        r"\u30f4\u30a1": "va",
        r"\u30f4\u30a3": "vi",
        r"\u30f4\u30a7": "ve",
        r"\u30f4\u30a9": "vo",
        r"\u30f4\u30e5": "vyu",
        r"\u30a6\u30a3": "wi",
        r"\u30a6\u30a7": "we",
        r"\u30a6\u30a9": "wo",
        r"\u30a4\u30a7": "ie",
        r"\u30ea\u30a7": "rie",
    }
)

SMALL_KANA_ROMAJI = build_map(
    {
        r"\u3083": "ya",
        r"\u3085": "yu",
        r"\u3087": "yo",
        r"\u3041": "a",
        r"\u3043": "i",
        r"\u3045": "u",
        r"\u3047": "e",
        r"\u3049": "o",
        r"\u30e3": "ya",
        r"\u30e5": "yu",
        r"\u30e7": "yo",
        r"\u30a1": "a",
        r"\u30a3": "i",
        r"\u30a5": "u",
        r"\u30a7": "e",
        r"\u30a9": "o",
    }
)

SMALL_TSU = {u(r"\u3063"), u(r"\u30c3")}
LONG_VOWEL_MARK = u(r"\u30fc")
PUNCTUATION = {
    " ": " ",
    "\u3000": " ",
    "(": "(",
    ")": ")",
    ";": ";",
    ",": ",",
    u(r"\u3001"): ",",
    u(r"\u301c"): "~",
    u(r"\uff5e"): "~",
    "~": "~",
}
VOWELS = set("aeiou")
TARGET_DIRECTORIES = ("csv/hiragana", "csv/katakana", "csv/kanji")


def discover_files() -> list[Path]:
    files: list[Path] = []
    for directory in TARGET_DIRECTORIES:
        files.extend(sorted((ROOT / directory).glob("*.csv")))
    return files


def get_columns(header: list[str]) -> tuple[int, int] | None:
    if header[:2] == ["Kana", "Romaji"]:
        return 0, 1
    if header[:3] == ["Kanji", "Kana", "Romaji"]:
        return 1, 2
    return None


def geminate(romaji: str) -> str:
    if not romaji:
        return romaji
    if romaji.startswith("ch"):
        return "t" + romaji
    if romaji.startswith("sh"):
        return "s" + romaji
    if romaji.startswith("ts"):
        return "t" + romaji
    if romaji[0] in VOWELS:
        return romaji
    return romaji[0] + romaji


def extend_long_vowel(parts: list[str]) -> None:
    current = "".join(parts)
    for char in reversed(current):
        if char in VOWELS:
            parts.append(char)
            return


def needs_apostrophe(parts: list[str], romaji: str) -> bool:
    current = "".join(parts)
    return current.endswith("n") and romaji[:1] in VOWELS.union({"y"})


def lookup_romaji(text: str, index: int) -> tuple[str | None, int]:
    if index + 1 < len(text):
        pair = text[index : index + 2]
        if pair in COMBO_ROMAJI:
            return COMBO_ROMAJI[pair], 2
        next_char = text[index + 1]
        if next_char in SMALL_KANA_ROMAJI and text[index] in SINGLE_ROMAJI:
            return SINGLE_ROMAJI[text[index]] + SMALL_KANA_ROMAJI[next_char], 2
    if text[index] in SINGLE_ROMAJI:
        return SINGLE_ROMAJI[text[index]], 1
    return None, 1


def transliterate(text: str) -> str:
    parts: list[str] = []
    index = 0
    pending_small_tsu = False

    while index < len(text):
        char = text[index]

        if char in PUNCTUATION:
            parts.append(PUNCTUATION[char])
            pending_small_tsu = False
            index += 1
            continue

        if char in SMALL_TSU:
            pending_small_tsu = True
            index += 1
            continue

        if char == LONG_VOWEL_MARK:
            extend_long_vowel(parts)
            index += 1
            continue

        romaji, consumed = lookup_romaji(text, index)
        if romaji is None:
            parts.append(char)
            pending_small_tsu = False
            index += 1
            continue

        if pending_small_tsu:
            romaji = geminate(romaji)
            pending_small_tsu = False

        if needs_apostrophe(parts, romaji):
            parts.append("'")

        parts.append(romaji)
        index += consumed

    return "".join(parts)


def load_rows(path: Path) -> tuple[list[list[str]], bool, str]:
    raw = path.read_bytes()
    has_bom = raw.startswith(codecs.BOM_UTF8)
    newline = "\r\n" if b"\r\n" in raw else "\n"
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.reader(handle))
    return rows, has_bom, newline


def write_rows(path: Path, rows: list[list[str]], has_bom: bool, newline: str) -> None:
    encoding = "utf-8-sig" if has_bom else "utf-8"
    with path.open("w", encoding=encoding, newline="") as handle:
        writer = csv.writer(handle, lineterminator=newline)
        writer.writerows(rows)


def validate_files(paths: Iterable[Path]) -> int:
    mismatch_count = 0

    for path in paths:
        rows, _, _ = load_rows(path)
        columns = get_columns(rows[0]) if rows else None
        if columns is None:
            continue

        kana_index, romaji_index = columns
        file_mismatches = 0

        for line_number, row in enumerate(rows[1:], start=2):
            if romaji_index >= len(row) or not row[romaji_index].strip():
                continue
            expected = transliterate(row[kana_index])
            if row[romaji_index] != expected:
                if file_mismatches < 10:
                    print(
                        f"{path.relative_to(ROOT)}:{line_number} "
                        f"stored={row[romaji_index]!r} expected={expected!r}"
                    )
                file_mismatches += 1

        if file_mismatches:
            mismatch_count += file_mismatches
            print(f"{path.relative_to(ROOT)} mismatches={file_mismatches}")

    return mismatch_count


def fill_files(paths: Iterable[Path]) -> int:
    total_filled = 0

    for path in paths:
        rows, has_bom, newline = load_rows(path)
        columns = get_columns(rows[0]) if rows else None
        if columns is None:
            continue

        kana_index, romaji_index = columns
        file_filled = 0

        for row in rows[1:]:
            if romaji_index >= len(row):
                row.extend([""] * (romaji_index + 1 - len(row)))
            if row[romaji_index].strip():
                continue
            row[romaji_index] = transliterate(row[kana_index])
            file_filled += 1

        if file_filled:
            write_rows(path, rows, has_bom, newline)
            total_filled += file_filled
            print(f"{path.relative_to(ROOT)} filled={file_filled}")

    return total_filled


def main() -> int:
    parser = argparse.ArgumentParser(description="Fill blank romaji columns in kana CSV files.")
    parser.add_argument("--validate", action="store_true", help="Validate existing romaji values.")
    parser.add_argument("paths", nargs="*", help="Optional CSV paths relative to the repo root.")
    args = parser.parse_args()

    paths = [ROOT / path for path in args.paths] if args.paths else discover_files()

    if args.validate:
        mismatch_count = validate_files(paths)
        if mismatch_count:
            print(f"total_mismatches={mismatch_count}")
            return 1
        print("validation_ok")
        return 0

    total_filled = fill_files(paths)
    print(f"total_filled={total_filled}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

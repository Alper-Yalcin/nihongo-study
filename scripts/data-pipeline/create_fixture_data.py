from __future__ import annotations

import argparse
import csv
import gzip
from pathlib import Path

from dictionary_common import (
    FIXTURES_DIR,
    build_kanji_character_record,
    build_word_record,
    ensure_directories,
    write_json,
    write_ndjson,
)


def write_jmdict_fixture(path: Path) -> None:
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<JMdict>
  <entry>
    <ent_seq>1001</ent_seq>
    <r_ele><reb>ああ</reb></r_ele>
    <sense><gloss>Ah!</gloss><gloss>Oh!</gloss></sense>
  </entry>
  <entry>
    <ent_seq>1002</ent_seq>
    <r_ele><reb>アパート</reb><re_pri>news1</re_pri></r_ele>
    <sense><gloss>apartment</gloss></sense>
  </entry>
  <entry>
    <ent_seq>1003</ent_seq>
    <k_ele><keb>会う</keb><ke_pri>ichi1</ke_pri></k_ele>
    <r_ele><reb>あう</reb><re_pri>news1</re_pri></r_ele>
    <sense><gloss>to meet</gloss><gloss>to see</gloss></sense>
  </entry>
</JMdict>
"""
    ensure_directories(path.parent)
    with gzip.open(path, "wt", encoding="utf-8") as handle:
        handle.write(xml)


def write_kanjidic_fixture(path: Path) -> None:
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<kanjidic2>
  <character>
    <literal>会</literal>
    <misc><stroke_count>6</stroke_count><freq>571</freq><jlpt>3</jlpt></misc>
    <reading_meaning>
      <rmgroup>
        <reading r_type="ja_on">カイ</reading>
        <reading r_type="ja_kun">あ.う</reading>
        <meaning>meeting</meaning>
        <meaning>meet</meaning>
      </rmgroup>
    </reading_meaning>
  </character>
  <character>
    <literal>学</literal>
    <misc><stroke_count>8</stroke_count><freq>135</freq><jlpt>4</jlpt></misc>
    <reading_meaning>
      <rmgroup>
        <reading r_type="ja_on">ガク</reading>
        <reading r_type="ja_kun">まな.ぶ</reading>
        <meaning>study</meaning>
        <meaning>learning</meaning>
      </rmgroup>
    </reading_meaning>
  </character>
</kanjidic2>
"""
    ensure_directories(path.parent)
    with gzip.open(path, "wt", encoding="utf-8") as handle:
        handle.write(xml)


def write_jlpt_fixture(path: Path) -> None:
    ensure_directories(path.parent)
    ensure_directories(path)
    rows_by_file = {
        "n5.csv": [
            ["expression", "reading", "meaning", "tags", "guid"],
            ["ああ", "ああ", "Ah!, Oh!", "JLPT JLPT_N5", "fixture-1"],
            ["アパート", "アパート", "apartment", "JLPT JLPT_N5", "fixture-2"],
            ["会う", "あう", "to meet, to see", "JLPT JLPT_N5", "fixture-3"],
        ],
        "n4.csv": [["expression", "reading", "meaning", "tags", "guid"]],
        "n3.csv": [["expression", "reading", "meaning", "tags", "guid"]],
        "n2.csv": [["expression", "reading", "meaning", "tags", "guid"]],
        "n1.csv": [["expression", "reading", "meaning", "tags", "guid"]],
    }
    for file_name, rows in rows_by_file.items():
        csv_path = path / file_name
        with csv_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.writer(handle)
            writer.writerows(rows)


def write_expected_outputs(base_dir: Path) -> None:
    expected_dir = base_dir / "expected"
    ensure_directories(expected_dir)

    hiragana = [
        build_word_record(
            script_type="hiragana_word",
            kanji=None,
            kana="ああ",
            meanings=["Ah!", "Oh!"],
            jlpt_level="N5",
            frequency=None,
            source="JMdict+JLPT",
            source_id="JMdict:1001",
        )
    ]
    katakana = [
        build_word_record(
            script_type="katakana_word",
            kanji=None,
            kana="アパート",
            meanings=["apartment"],
            jlpt_level="N5",
            frequency={"scheme": "jmdict_pri", "values": ["news1"]},
            source="JMdict+JLPT",
            source_id="JMdict:1002",
        )
    ]
    kanji_words = [
        build_word_record(
            script_type="kanji_word",
            kanji="会う",
            kana="あう",
            meanings=["to meet", "to see"],
            jlpt_level="N5",
            frequency={"scheme": "jmdict_pri", "values": ["ichi1", "news1"]},
            source="JMdict+JLPT",
            source_id="JMdict:1003",
        )
    ]
    kanji_characters = [
        build_kanji_character_record(
            literal="会",
            meanings=["meeting", "meet"],
            onyomi=["カイ"],
            kunyomi=["あ.う"],
            jlpt_level=None,
            stroke_count=6,
            frequency={"scheme": "kanjidic_freq", "value": 571},
            source="KANJIDIC2",
            source_id="KANJIDIC2:会",
        ),
        build_kanji_character_record(
            literal="学",
            meanings=["study", "learning"],
            onyomi=["ガク"],
            kunyomi=["まな.ぶ"],
            jlpt_level=None,
            stroke_count=8,
            frequency={"scheme": "kanjidic_freq", "value": 135},
            source="KANJIDIC2",
            source_id="KANJIDIC2:学",
        ),
    ]

    write_ndjson(hiragana, expected_dir / "hiragana_words.ndjson")
    write_ndjson(katakana, expected_dir / "katakana_words.ndjson")
    write_ndjson(kanji_words, expected_dir / "kanji_words.ndjson")
    write_ndjson(kanji_characters, expected_dir / "kanji_characters.ndjson")

    write_json(
        {
            "total_jmdict_word_records": 3,
            "total_kanji_character_records": 2,
            "hiragana_word_count": 1,
            "katakana_word_count": 1,
            "kanji_word_count": 1,
            "jlpt_matched_count": 3,
            "jlpt_unmatched_count": 0,
            "exact_pair_match_count": 3,
            "fallback_match_count": 0,
            "conflict_count": 0,
            "normalized_pair_match_count": 0,
            "kana_only_match_count": 0,
            "parse_error_count": 0,
            "validation_error_count": 0,
            "jmdict_entries_seen": 3,
            "kanjidic_characters_seen": 2,
        },
        expected_dir / "summary.json",
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Create fixture raw data and expected NDJSON outputs.")
    parser.add_argument(
        "--fixture-dir",
        type=Path,
        default=FIXTURES_DIR / "baseline",
        help="Fixture directory root.",
    )
    args = parser.parse_args()

    raw_dir = args.fixture_dir / "raw"
    write_jmdict_fixture(raw_dir / "jmdict" / "JMdict_b.gz")
    write_kanjidic_fixture(raw_dir / "kanjidic2" / "kanjidic2.xml.gz")
    write_jlpt_fixture(raw_dir / "jlpt")
    write_expected_outputs(args.fixture_dir)
    print(f"fixture_dir={args.fixture_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

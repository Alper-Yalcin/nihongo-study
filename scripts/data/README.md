# Normalized Dictionary Pipeline

## Commands

```bash
npm run data:download
npm run data:normalize
npm run data:validate
npm run data:fixture
```

## Script Order

1. `download_sources.py`
2. `parse_jmdict.py`
3. `parse_kanjidic.py`
4. `merge_jlpt.py`
5. `generate_ndjson.py`
6. `validate_normalized.py`

Orchestrated by:

- `build_normalized_dictionary.py`

## Default Inputs

- `Backend/data-sources/raw/jmdict/JMdict_b.gz`
- `Backend/data-sources/raw/kanjidic2/kanjidic2.xml.gz`
- `Backend/data-sources/raw/jlpt/n5.csv` ... `n1.csv`

## Default Outputs

- `Backend/data-sources/normalized/hiragana_words.ndjson`
- `Backend/data-sources/normalized/katakana_words.ndjson`
- `Backend/data-sources/normalized/kanji_words.ndjson`
- `Backend/data-sources/normalized/kanji_characters.ndjson`

## Default Reports

- `reports/summary.json`
- `reports/jlpt_conflicts.ndjson`
- `reports/jlpt_unmatched.ndjson`
- `reports/parse_errors.ndjson`

## Validation Rules

- `script_type` must be one of `hiragana_word`, `katakana_word`, `kanji_word`, `kanji_character`
- `meanings` must be a non-empty array
- `kanji_word` must have non-empty `kana`
- `kanji_character` must have exactly one-character `kanji`
- `romaji` must be `string | null`
- `jlpt_level` must be `N5/N4/N3/N2/N1/null`

## Matching Rules

1. Exact `(expression, kana)`
2. Normalized `(expression, kana)` after punctuation cleanup
3. `kana` only

Conflicts are written to `reports/jlpt_conflicts.ndjson`.
Unmatched word records are written to `reports/jlpt_unmatched.ndjson`.

## Fixtures

- `create_fixture_data.py` writes a small local source bundle plus expected NDJSON outputs.
- `run_fixture_pipeline.py` runs the full pipeline on the fixtures and compares outputs.

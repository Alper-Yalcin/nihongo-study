from __future__ import annotations

import argparse
import json
import sqlite3
import time
import unicodedata
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests


ROOT = Path(__file__).resolve().parents[1]
DATABASE_PATH = ROOT / "database" / "nihongo-study.sqlite"
TABLES = ("hiragana_words", "katakana_words", "kanji_words")
VALID_LEVELS = ("N5", "N4", "N3", "N2", "N1")
LEVEL_ORDER = {level: index for index, level in enumerate(VALID_LEVELS)}
JISHO_API_URL = "https://jisho.org/api/v1/search/words"


@dataclass(slots=True)
class PendingRecord:
    table_name: str
    record_id: str
    source_id: str
    kanji: str | None
    kana: str | None
    romaji: str | None


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_text(value: str | None) -> str:
    if value is None:
      return ""
    return unicodedata.normalize("NFKC", value).strip()


def normalize_surface(value: str | None) -> str:
    text = normalize_text(value)
    if not text:
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
    return "".join(char for char in text if char not in removable)


def parse_levels(values: list[str] | None) -> list[str]:
    if not values:
        return []

    levels: list[str] = []
    for value in values:
        normalized = value.strip().lower()
        if normalized.startswith("jlpt-n"):
            level = f"N{normalized[-1]}"
            if level in LEVEL_ORDER and level not in levels:
                levels.append(level)
    return levels


def pick_level(levels: set[str]) -> str | None:
    if not levels:
        return None
    return min(levels, key=lambda level: LEVEL_ORDER[level])


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def ensure_web_lookup_tables(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS jlpt_web_lookup_cache (
          query TEXT PRIMARY KEY,
          response_json TEXT NOT NULL,
          fetched_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS jlpt_web_enrichment (
          table_name TEXT NOT NULL,
          record_id TEXT PRIMARY KEY,
          source_id TEXT NOT NULL,
          query TEXT NOT NULL,
          status TEXT NOT NULL,
          selected_level TEXT,
          match_strategy TEXT,
          candidate_levels TEXT NOT NULL,
          details_json TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_jlpt_web_enrichment_table_name
          ON jlpt_web_enrichment (table_name);

        CREATE INDEX IF NOT EXISTS idx_jlpt_web_enrichment_status
          ON jlpt_web_enrichment (status);
        """
    )
    connection.commit()


def load_pending_records(connection: sqlite3.Connection, table_name: str, limit: int | None) -> list[PendingRecord]:
    sql = f"""
      SELECT
        id AS record_id,
        source_id,
        kanji,
        kana,
        romaji
      FROM {table_name}
      WHERE jlpt_level IS NULL
        AND id NOT IN (
          SELECT record_id
          FROM jlpt_web_enrichment
          WHERE table_name = ?
        )
      ORDER BY COALESCE(kanji, kana), kana, id
    """

    params: list[Any] = [table_name]
    if limit is not None:
        sql += " LIMIT ?"
        params.append(limit)

    rows = connection.execute(sql, params).fetchall()
    return [
        PendingRecord(
            table_name=table_name,
            record_id=row["record_id"],
            source_id=row["source_id"],
            kanji=row["kanji"],
            kana=row["kana"],
            romaji=row["romaji"],
        )
        for row in rows
    ]


def get_cached_or_fetch(session: requests.Session, connection: sqlite3.Connection, query: str, timeout: float) -> dict[str, Any]:
    cached = connection.execute(
        "SELECT response_json FROM jlpt_web_lookup_cache WHERE query = ?",
        (query,),
    ).fetchone()
    if cached:
        return json.loads(cached["response_json"])

    response = session.get(JISHO_API_URL, params={"keyword": query}, timeout=timeout)
    response.raise_for_status()
    payload = response.json()
    connection.execute(
        """
        INSERT INTO jlpt_web_lookup_cache (query, response_json, fetched_at)
        VALUES (?, ?, ?)
        ON CONFLICT(query) DO UPDATE SET
          response_json = excluded.response_json,
          fetched_at = excluded.fetched_at
        """,
        (query, json.dumps(payload, ensure_ascii=False), utc_now()),
    )
    connection.commit()
    return payload


def get_cached_or_fetch_with_retry(
    session: requests.Session,
    connection: sqlite3.Connection,
    query: str,
    timeout: float,
    retry_sleep_seconds: float,
    max_retries: int,
) -> dict[str, Any]:
    attempt = 0

    while True:
        try:
            return get_cached_or_fetch(session, connection, query, timeout)
        except requests.HTTPError as error:
            status_code = error.response.status_code if error.response is not None else None
            if status_code == 429 and attempt < max_retries:
                sleep_seconds = retry_sleep_seconds * (attempt + 1)
                print(f"rate_limited query={query!r} sleeping={sleep_seconds}s attempt={attempt + 1}/{max_retries}")
                time.sleep(sleep_seconds)
                attempt += 1
                continue
            raise


def match_forms(record: PendingRecord, entry: dict[str, Any]) -> tuple[str | None, list[str]]:
    japanese_forms = entry.get("japanese") or []
    if not isinstance(japanese_forms, list):
        return None, []

    record_kanji = normalize_text(record.kanji)
    record_kana = normalize_text(record.kana)
    record_kanji_normalized = normalize_surface(record.kanji)
    record_kana_normalized = normalize_surface(record.kana)
    matched_forms: list[str] = []
    best_strategy: str | None = None

    for form in japanese_forms:
        if not isinstance(form, dict):
            continue

        word = normalize_text(form.get("word"))
        reading = normalize_text(form.get("reading"))
        word_normalized = normalize_surface(form.get("word"))
        reading_normalized = normalize_surface(form.get("reading"))

        if record_kanji:
            if word == record_kanji and reading == record_kana:
                matched_forms.append(f"{word}|{reading}")
                best_strategy = "exact_pair"
                continue
            if best_strategy is None and word_normalized == record_kanji_normalized and reading_normalized == record_kana_normalized:
                matched_forms.append(f"{word}|{reading}")
                best_strategy = "normalized_pair"
                continue
            if best_strategy is None and reading == record_kana:
                matched_forms.append(f"{word}|{reading}")
                best_strategy = "reading_only"
        else:
            if reading == record_kana and (not word or word == record_kana):
                matched_forms.append(f"{word or reading}|{reading}")
                best_strategy = "exact_kana"
                continue
            if best_strategy is None and reading_normalized == record_kana_normalized:
                matched_forms.append(f"{word or reading}|{reading}")
                best_strategy = "reading_only"

    return best_strategy, matched_forms


def resolve_entry(record: PendingRecord, payload: dict[str, Any]) -> dict[str, Any]:
    data = payload.get("data") or []
    if not isinstance(data, list):
        return {
            "status": "error",
            "selected_level": None,
            "candidate_levels": [],
            "match_strategy": None,
            "details": {"reason": "Invalid API payload"},
        }

    priority = {
        "exact_pair": 1,
        "exact_kana": 1,
        "normalized_pair": 2,
        "reading_only": 3,
    }

    matched_entries: list[dict[str, Any]] = []
    best_rank = 99

    for entry in data:
        if not isinstance(entry, dict):
            continue
        strategy, matched_forms = match_forms(record, entry)
        if strategy is None:
            continue

        rank = priority[strategy]
        if rank < best_rank:
            matched_entries = []
            best_rank = rank

        if rank == best_rank:
            matched_entries.append(
                {
                    "slug": entry.get("slug"),
                    "strategy": strategy,
                    "jlpt": parse_levels(entry.get("jlpt")),
                    "matched_forms": matched_forms,
                }
            )

    if not matched_entries:
        return {
            "status": "unmatched",
            "selected_level": None,
            "candidate_levels": [],
            "match_strategy": None,
            "details": {"reason": "No matching Jisho entry"},
        }

    candidate_levels = {
        level
        for entry in matched_entries
        for level in entry["jlpt"]
        if level in LEVEL_ORDER
    }

    if not candidate_levels:
        return {
            "status": "unmatched",
            "selected_level": None,
            "candidate_levels": [],
            "match_strategy": matched_entries[0]["strategy"],
            "details": {"matched_entries": matched_entries, "reason": "Matched entry has no JLPT data"},
        }

    selected_level = pick_level(candidate_levels)
    status = "matched" if len(candidate_levels) == 1 else "conflict"
    return {
        "status": status,
        "selected_level": selected_level,
        "candidate_levels": sorted(candidate_levels, key=lambda level: LEVEL_ORDER[level]),
        "match_strategy": matched_entries[0]["strategy"],
        "details": {"matched_entries": matched_entries},
    }


def persist_result(connection: sqlite3.Connection, record: PendingRecord, query: str, result: dict[str, Any]) -> None:
    if result["selected_level"]:
        connection.execute(
            f"UPDATE {record.table_name} SET jlpt_level = ? WHERE id = ? AND jlpt_level IS NULL",
            (result["selected_level"], record.record_id),
        )

    connection.execute(
        """
        INSERT INTO jlpt_web_enrichment (
          table_name,
          record_id,
          source_id,
          query,
          status,
          selected_level,
          match_strategy,
          candidate_levels,
          details_json,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(record_id) DO UPDATE SET
          table_name = excluded.table_name,
          source_id = excluded.source_id,
          query = excluded.query,
          status = excluded.status,
          selected_level = excluded.selected_level,
          match_strategy = excluded.match_strategy,
          candidate_levels = excluded.candidate_levels,
          details_json = excluded.details_json,
          updated_at = excluded.updated_at
        """,
        (
            record.table_name,
            record.record_id,
            record.source_id,
            query,
            result["status"],
            result["selected_level"],
            result["match_strategy"],
            json.dumps(result["candidate_levels"], ensure_ascii=False),
            json.dumps(result["details"], ensure_ascii=False),
            utc_now(),
        ),
    )
    connection.commit()


def update_progress_file(progress_path: Path, stats: dict[str, Any]) -> None:
    progress_path.parent.mkdir(parents=True, exist_ok=True)
    progress_path.write_text(json.dumps(stats, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def run_enrichment(
    *,
    database_path: Path,
    tables: list[str],
    delay_seconds: float,
    retry_sleep_seconds: float,
    max_retries: int,
    per_table_limit: int | None,
    timeout_seconds: float,
    progress_path: Path,
) -> dict[str, Any]:
    stats = {
        "started_at": utc_now(),
        "database_path": str(database_path),
        "tables": {},
        "processed": 0,
        "matched": 0,
        "conflicts": 0,
        "unmatched": 0,
        "errors": 0,
    }

    connection = get_connection()
    ensure_web_lookup_tables(connection)
    session = requests.Session()
    session.headers.update({"User-Agent": "nihongo-study-jlpt-enricher/1.0"})

    try:
        for table_name in tables:
            pending_records = load_pending_records(connection, table_name, per_table_limit)
            table_stats = {
                "pending": len(pending_records),
                "processed": 0,
                "matched": 0,
                "conflicts": 0,
                "unmatched": 0,
                "errors": 0,
            }
            stats["tables"][table_name] = table_stats
            update_progress_file(progress_path, stats)

            for index, record in enumerate(pending_records, start=1):
                query = normalize_text(record.kanji) or normalize_text(record.kana)
                if not query:
                    result = {
                        "status": "error",
                        "selected_level": None,
                        "candidate_levels": [],
                        "match_strategy": None,
                        "details": {"reason": "Record has no queryable kanji or kana"},
                    }
                else:
                    try:
                        payload = get_cached_or_fetch_with_retry(
                            session,
                            connection,
                            query,
                            timeout_seconds,
                            retry_sleep_seconds,
                            max_retries,
                        )
                        result = resolve_entry(record, payload)
                    except Exception as error:
                        result = {
                            "status": "error",
                            "selected_level": None,
                            "candidate_levels": [],
                            "match_strategy": None,
                            "details": {"reason": str(error)},
                        }

                persist_result(connection, record, query, result)

                table_stats["processed"] += 1
                stats["processed"] += 1

                if result["status"] == "matched":
                    table_stats["matched"] += 1
                    stats["matched"] += 1
                elif result["status"] == "conflict":
                    table_stats["conflicts"] += 1
                    stats["conflicts"] += 1
                elif result["status"] == "unmatched":
                    table_stats["unmatched"] += 1
                    stats["unmatched"] += 1
                else:
                    table_stats["errors"] += 1
                    stats["errors"] += 1

                if index % 25 == 0:
                    update_progress_file(progress_path, stats)
                    print(
                        f"{table_name}: processed={table_stats['processed']}/{table_stats['pending']} "
                        f"matched={table_stats['matched']} conflict={table_stats['conflicts']} "
                        f"unmatched={table_stats['unmatched']} errors={table_stats['errors']}"
                    )

                if delay_seconds > 0:
                    time.sleep(delay_seconds)

        stats["finished_at"] = utc_now()
        update_progress_file(progress_path, stats)
        return stats
    finally:
        session.close()
        connection.close()


def main() -> int:
    parser = argparse.ArgumentParser(description="Sequentially enrich missing JLPT levels via Jisho web lookups.")
    parser.add_argument(
        "--database",
        type=Path,
        default=DATABASE_PATH,
        help="SQLite database path.",
    )
    parser.add_argument(
        "--tables",
        nargs="*",
        default=list(TABLES),
        help="Target tables. Defaults to all word tables.",
    )
    parser.add_argument(
        "--per-table-limit",
        type=int,
        default=None,
        help="Optional limit per table for testing or chunked runs.",
    )
    parser.add_argument(
        "--delay-seconds",
        type=float,
        default=0.15,
        help="Delay between internet requests.",
    )
    parser.add_argument(
        "--retry-sleep-seconds",
        type=float,
        default=15.0,
        help="Base sleep duration after HTTP 429 rate limits.",
    )
    parser.add_argument(
        "--max-retries",
        type=int,
        default=4,
        help="Maximum number of HTTP 429 retries per query.",
    )
    parser.add_argument(
        "--timeout-seconds",
        type=float,
        default=20.0,
        help="HTTP timeout per request.",
    )
    parser.add_argument(
        "--progress-file",
        type=Path,
        default=ROOT / "reports" / "jlpt_web_progress.json",
        help="JSON progress output path.",
    )
    args = parser.parse_args()

    invalid_tables = [table for table in args.tables if table not in TABLES]
    if invalid_tables:
        raise SystemExit(f"Unsupported tables: {', '.join(invalid_tables)}")

    stats = run_enrichment(
        database_path=args.database,
        tables=args.tables,
        delay_seconds=args.delay_seconds,
        retry_sleep_seconds=args.retry_sleep_seconds,
        max_retries=args.max_retries,
        per_table_limit=args.per_table_limit,
        timeout_seconds=args.timeout_seconds,
        progress_path=args.progress_file,
    )
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

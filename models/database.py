import sqlite3
import os
from pathlib import Path

from werkzeug.security import generate_password_hash

from models.major_catalog import DEFAULT_MAJORS
from models.result_hash import build_result_hash


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = Path(os.environ.get("EDUMATCH_DATABASE_PATH", str(DATA_DIR / "edumatch.db")))

DEFAULT_ADMIN = {
    "name": "Admin EduMatch",
    "email": "admin@gmail.com",
    "password": "123",
}


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            jurusan TEXT NOT NULL DEFAULT 'IPA',
            is_active INTEGER NOT NULL DEFAULT 1
        )
        """
    )

    cursor.execute("PRAGMA table_info(users)")
    user_columns = {column["name"] for column in cursor.fetchall()}
    if "jurusan" not in user_columns:
        cursor.execute("ALTER TABLE users ADD COLUMN jurusan TEXT NOT NULL DEFAULT 'IPA'")
    if "is_active" not in user_columns:
        cursor.execute("ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1")

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS majors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL UNIQUE,
            field TEXT NOT NULL,
            min_score REAL NOT NULL,
            ukt INTEGER NOT NULL,
            ukt_min INTEGER NOT NULL DEFAULT 0,
            ukt_max INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    cursor.execute("PRAGMA table_info(majors)")
    major_columns = {column["name"] for column in cursor.fetchall()}
    if "slug" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN slug TEXT")
    if "field" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN field TEXT NOT NULL DEFAULT 'Soshum'")
    if "ukt_min" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN ukt_min INTEGER NOT NULL DEFAULT 0")
    if "ukt_max" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN ukt_max INTEGER NOT NULL DEFAULT 0")
    if "match" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN match REAL NOT NULL DEFAULT 0")
    if "duration" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN duration TEXT NOT NULL DEFAULT '8 Semester (4 Tahun)'")
    if "accreditation" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN accreditation TEXT NOT NULL DEFAULT 'Baik'")
    if "total_students" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN total_students TEXT NOT NULL DEFAULT 'Data belum tersedia'")
    if "short_desc" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN short_desc TEXT NOT NULL DEFAULT ''")
    if "description" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN description TEXT NOT NULL DEFAULT ''")
    if "what_you_learn" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN what_you_learn TEXT NOT NULL DEFAULT '[]'")
    if "career_prospects" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN career_prospects TEXT NOT NULL DEFAULT '[]'")
    if "why_choose" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN why_choose TEXT NOT NULL DEFAULT '[]'")
    if "icon" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN icon TEXT NOT NULL DEFAULT ''")
    if "color" not in major_columns:
        cursor.execute("ALTER TABLE majors ADD COLUMN color TEXT NOT NULL DEFAULT ''")

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            result_json TEXT NOT NULL,
            result_hash TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )

    cursor.execute("PRAGMA table_info(results)")
    result_columns = {column["name"] for column in cursor.fetchall()}
    if "result_hash" not in result_columns:
        cursor.execute("ALTER TABLE results ADD COLUMN result_hash TEXT")

    _sync_result_hashes(cursor)
    cursor.execute(
        """
        CREATE UNIQUE INDEX IF NOT EXISTS idx_results_user_hash
        ON results (user_id, result_hash)
        """
    )

    _sync_default_majors(cursor)

    cursor.execute("SELECT id FROM users WHERE email = ?", (DEFAULT_ADMIN["email"],))
    admin_row = cursor.fetchone()
    if admin_row is None:
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (
                DEFAULT_ADMIN["name"],
                DEFAULT_ADMIN["email"],
                generate_password_hash(DEFAULT_ADMIN["password"]),
            ),
        )

    connection.commit()
    connection.close()



def _sync_default_majors(cursor: sqlite3.Cursor) -> None:
    for major in DEFAULT_MAJORS:
        cursor.execute("SELECT id FROM majors WHERE slug = ? OR name = ?", (major["slug"], major["name"]))
        existing = cursor.fetchone()
        if existing is None:
            cursor.execute(
                """
                INSERT INTO majors (slug, name, field, min_score, ukt, ukt_min, ukt_max)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    major["slug"],
                    major["name"],
                    major["field"],
                    major["min_score"],
                    major["ukt"],
                    major["ukt_min"],
                    major["ukt_max"],
                ),
            )
        else:
            cursor.execute(
                """
                UPDATE majors
                SET slug = ?, name = ?, field = ?, min_score = ?, ukt = ?, ukt_min = ?, ukt_max = ?
                WHERE id = ?
                """,
                (
                    major["slug"],
                    major["name"],
                    major["field"],
                    major["min_score"],
                    major["ukt"],
                    major["ukt_min"],
                    major["ukt_max"],
                    existing["id"],
                ),
            )


def _sync_result_hashes(cursor: sqlite3.Cursor) -> None:
    cursor.execute(
        """
        SELECT id, user_id, result_json, result_hash
        FROM results
        ORDER BY id DESC
        """
    )
    rows = [dict(row) for row in cursor.fetchall()]
    seen_keys: set[tuple[int, str]] = set()

    for row in rows:
        result_hash = row.get("result_hash") or build_result_hash(row["result_json"])

        if row.get("result_hash") != result_hash:
            cursor.execute(
                "UPDATE results SET result_hash = ? WHERE id = ?",
                (result_hash, row["id"]),
            )

        dedupe_key = (int(row["user_id"]), result_hash)
        if dedupe_key in seen_keys:
            cursor.execute("DELETE FROM results WHERE id = ?", (row["id"],))
            continue

        seen_keys.add(dedupe_key)

import sqlite3
from pathlib import Path

from werkzeug.security import generate_password_hash

from models.major_catalog import DEFAULT_MAJORS


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = DATA_DIR / "edumatch.db"

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
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            jurusan TEXT NOT NULL DEFAULT 'IPA'
        )
        """
    )

    cursor.execute("PRAGMA table_info(users)")
    user_columns = {column["name"] for column in cursor.fetchall()}
    if "jurusan" not in user_columns:
        cursor.execute("ALTER TABLE users ADD COLUMN jurusan TEXT NOT NULL DEFAULT 'IPA'")

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

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            result_json TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
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
    valid_slugs = {major["slug"] for major in DEFAULT_MAJORS}
    valid_names = {major["name"] for major in DEFAULT_MAJORS}

    cursor.execute("SELECT id, slug, name FROM majors")
    existing_rows = [dict(row) for row in cursor.fetchall()]

    for row in existing_rows:
        row_slug = row.get("slug")
        row_name = row.get("name")
        if row_slug not in valid_slugs and row_name not in valid_names:
            cursor.execute("DELETE FROM majors WHERE id = ?", (row["id"],))

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

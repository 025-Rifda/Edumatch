import sqlite3
from pathlib import Path

from werkzeug.security import generate_password_hash


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATABASE_PATH = DATA_DIR / "edumatch.db"

DEFAULT_MAJORS = [
    ("Teknik Informatika", 82.0, 4500000),
    ("Sistem Informasi", 78.0, 4000000),
    ("Ilmu Komputer", 80.0, 4300000),
    ("Teknik Elektro", 81.0, 4700000),
    ("Teknik Industri", 79.0, 4200000),
    ("Kedokteran", 90.0, 9500000),
    ("Farmasi", 84.0, 6800000),
    ("Keperawatan", 78.0, 5200000),
    ("Manajemen", 75.0, 3600000),
    ("Akuntansi", 76.0, 3400000),
    ("Ilmu Komunikasi", 74.0, 3900000),
    ("Psikologi", 77.0, 4100000),
    ("Hukum", 76.0, 3500000),
    ("Matematika", 80.0, 3000000),
    ("Statistika", 81.0, 3200000),
    ("Biologi", 77.0, 3100000),
    ("Kimia", 78.0, 3300000),
    ("Pendidikan Dokter", 92.0, 10000000),
]

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
            name TEXT NOT NULL UNIQUE,
            min_score REAL NOT NULL,
            ukt INTEGER NOT NULL
        )
        """
    )

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

    cursor.execute("SELECT COUNT(*) AS total FROM majors")
    if cursor.fetchone()["total"] == 0:
        cursor.executemany(
            "INSERT INTO majors (name, min_score, ukt) VALUES (?, ?, ?)",
            DEFAULT_MAJORS,
        )

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

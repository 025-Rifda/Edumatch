from typing import Optional

from models.database import get_connection


def create_user(name: str, email: str, password: str) -> int:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, password),
    )
    connection.commit()
    user_id = cursor.lastrowid
    connection.close()
    return user_id


def get_user_by_email(email: str) -> Optional[dict]:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    connection.close()
    return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[dict]:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT id, name, email FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    connection.close()
    return dict(row) if row else None

from typing import Optional

from models.database import get_connection


def create_user(name: str, email: str, password: str, jurusan: str) -> int:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO users (name, email, password, jurusan) VALUES (?, ?, ?, ?)",
        (name, email, password, jurusan),
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
    cursor.execute("SELECT id, name, email, jurusan FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    connection.close()
    return dict(row) if row else None


def count_users(excluded_emails: set[str] | None = None) -> int:
    connection = get_connection()
    cursor = connection.cursor()

    if excluded_emails:
        placeholders = ", ".join("?" for _ in excluded_emails)
        cursor.execute(
            f"SELECT COUNT(*) AS total FROM users WHERE email NOT IN ({placeholders})",
            tuple(excluded_emails),
        )
    else:
        cursor.execute("SELECT COUNT(*) AS total FROM users")

    total = int(cursor.fetchone()["total"])
    connection.close()
    return total


def get_user_stats(excluded_emails: set[str] | None = None) -> dict[str, int]:
    connection = get_connection()
    cursor = connection.cursor()

    base_query = """
        SELECT
            COUNT(*) AS total_users,
            SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_users,
            SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive_users
        FROM users
    """

    params: tuple[str, ...] = ()
    if excluded_emails:
        placeholders = ", ".join("?" for _ in excluded_emails)
        base_query += f" WHERE email NOT IN ({placeholders})"
        params = tuple(excluded_emails)

    cursor.execute(base_query, params)
    row = cursor.fetchone()
    connection.close()

    return {
        "totalUsers": int(row["total_users"] or 0),
        "activeUsers": int(row["active_users"] or 0),
        "inactiveUsers": int(row["inactive_users"] or 0),
    }

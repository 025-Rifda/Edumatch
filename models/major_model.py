from typing import Optional

from models.database import get_connection


def get_all_majors() -> list[dict]:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM majors ORDER BY name ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    connection.close()
    return rows


def get_major_by_id(major_id: int) -> Optional[dict]:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM majors WHERE id = ?", (major_id,))
    row = cursor.fetchone()
    connection.close()
    return dict(row) if row else None


def create_major(name: str, min_score: float, ukt: int) -> int:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO majors (name, min_score, ukt) VALUES (?, ?, ?)",
        (name, min_score, ukt),
    )
    connection.commit()
    major_id = cursor.lastrowid
    connection.close()
    return major_id


def update_major(major_id: int, name: str, min_score: float, ukt: int) -> None:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        UPDATE majors
        SET name = ?, min_score = ?, ukt = ?
        WHERE id = ?
        """,
        (name, min_score, ukt, major_id),
    )
    connection.commit()
    connection.close()


def delete_major(major_id: int) -> None:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM majors WHERE id = ?", (major_id,))
    connection.commit()
    connection.close()

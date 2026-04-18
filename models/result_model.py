from models.database import get_connection
from models.result_hash import build_result_hash


def create_result(user_id: int, result_json: str) -> int:
    connection = get_connection()
    cursor = connection.cursor()
    result_hash = build_result_hash(result_json)
    cursor.execute(
        """
        INSERT INTO results (user_id, result_json, result_hash)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, result_hash) DO NOTHING
        """,
        (user_id, result_json, result_hash),
    )

    if cursor.rowcount == 0:
        cursor.execute(
            """
            SELECT id
            FROM results
            WHERE user_id = ? AND result_hash = ?
            """,
            (user_id, result_hash),
        )
        result_id = int(cursor.fetchone()["id"])
    else:
        result_id = cursor.lastrowid

    connection.commit()
    connection.close()
    return result_id


def get_results_by_user_id(user_id: int) -> list[dict]:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT id, user_id, result_json, result_hash, created_at
        FROM results
        WHERE user_id = ?
        ORDER BY datetime(created_at) DESC, id DESC
        """,
        (user_id,),
    )
    rows = [dict(row) for row in cursor.fetchall()]
    connection.close()
    return rows

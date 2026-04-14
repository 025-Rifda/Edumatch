from models.database import get_connection


def create_result(user_id: int, result_json: str) -> int:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO results (user_id, result_json) VALUES (?, ?)",
        (user_id, result_json),
    )
    connection.commit()
    result_id = cursor.lastrowid
    connection.close()
    return result_id


def get_results_by_user_id(user_id: int) -> list[dict]:
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT id, user_id, result_json, created_at
        FROM results
        WHERE user_id = ?
        ORDER BY datetime(created_at) DESC, id DESC
        """,
        (user_id,),
    )
    rows = [dict(row) for row in cursor.fetchall()]
    connection.close()
    return rows

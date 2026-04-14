import json

from models.result_model import get_results_by_user_id
from models.user_model import get_user_by_id


def fetch_history(user_id: int) -> tuple[dict, int]:
    user = get_user_by_id(user_id)
    if user is None:
        return {"error": "User not found."}, 404

    history = []
    for row in get_results_by_user_id(user_id):
        parsed_result = json.loads(row["result_json"])
        history.append(
            {
                "id": row["id"],
                "user_id": row["user_id"],
                "created_at": row["created_at"],
                "top_major": parsed_result["top3"][0] if parsed_result.get("top3") else None,
                "top3": parsed_result.get("top3", []),
                "top10": parsed_result.get("top10", []),
            }
        )

    return {"user": user, "history": history}, 200

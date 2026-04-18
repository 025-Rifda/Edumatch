import json

from models.result_model import get_results_by_user_id
from models.user_model import get_user_by_id


def fetch_history(user_id: int) -> tuple[dict, int]:
    user = get_user_by_id(user_id)
    if user is None:
        return {"error": "User not found."}, 404

    history = []
    seen_hashes: set[str] = set()
    for row in get_results_by_user_id(user_id):
        result_hash = str(row.get("result_hash") or "")
        if result_hash and result_hash in seen_hashes:
            continue

        parsed_result = json.loads(row["result_json"])
        normalized_top10 = [_normalize_history_major(major) for major in parsed_result.get("top10", [])]
        normalized_top3 = [_normalize_history_major(major) for major in parsed_result.get("top3", [])]

        history.append(
            {
                "id": row["id"],
                "user_id": row["user_id"],
                "created_at": row["created_at"],
                "top_major": normalized_top3[0] if normalized_top3 else None,
                "top3": normalized_top3,
                "top10": normalized_top10[:10],
            }
        )
        if result_hash:
            seen_hashes.add(result_hash)

    return {"user": user, "history": history}, 200


def _normalize_history_major(major: dict) -> dict:
    normalized_major = dict(major)
    slug = str(normalized_major.get("slug") or "").strip().lower()
    if not slug:
        slug = str(normalized_major.get("name", "")).strip().lower().replace(" ", "-")
    normalized_major["slug"] = slug
    return normalized_major

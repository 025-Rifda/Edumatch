import sqlite3

from models.major_catalog import slugify_major_name
from models.major_model import create_major, delete_major, get_major_by_id, get_major_by_slug, update_major


def _validate_major_payload(payload: dict, require_id: bool = False) -> tuple[dict, int] | None:
    name = str(payload.get("name", "")).strip()
    slug = str(payload.get("slug", slugify_major_name(name))).strip().lower()
    field = str(payload.get("field", "")).strip() or "Soshum"
    min_score = payload.get("min_score")
    ukt_min = payload.get("ukt_min", payload.get("ukt"))
    ukt_max = payload.get("ukt_max", payload.get("ukt"))

    if require_id and payload.get("id") is None:
        return {"error": "id is required."}, 400

    if not name:
        return {"error": "name is required."}, 400

    if not slug:
        return {"error": "slug is required."}, 400

    if field not in {"Saintek", "Soshum"}:
        return {"error": "field must be either Saintek or Soshum."}, 400

    try:
        min_score = float(min_score)
    except (TypeError, ValueError):
        return {"error": "min_score must be a number."}, 400

    try:
        ukt_min = int(ukt_min)
        ukt_max = int(ukt_max)
    except (TypeError, ValueError):
        return {"error": "ukt_min and ukt_max must be integers."}, 400

    if min_score < 0 or min_score > 100:
        return {"error": "min_score must be between 0 and 100."}, 400

    if ukt_min < 0 or ukt_max < 0:
        return {"error": "ukt_min and ukt_max must be zero or greater."}, 400

    if ukt_min > ukt_max:
        return {"error": "ukt_max must be greater than or equal to ukt_min."}, 400

    payload["slug"] = slug
    payload["name"] = name
    payload["field"] = field
    payload["min_score"] = min_score
    payload["ukt_min"] = ukt_min
    payload["ukt_max"] = ukt_max
    payload["ukt"] = ukt_max
    return None


def add_major(payload: dict) -> tuple[dict, int]:
    validation_error = _validate_major_payload(payload)
    if validation_error:
        return validation_error

    try:
        major_id = create_major(
            payload["slug"],
            payload["name"],
            payload["field"],
            payload["min_score"],
            payload["ukt"],
            payload["ukt_min"],
            payload["ukt_max"],
        )
    except sqlite3.IntegrityError:
        return {"error": "Major slug or name already exists."}, 409

    return {
        "message": "Major created successfully.",
        "major": {
            "id": major_id,
            "slug": payload["slug"],
            "name": payload["name"],
            "field": payload["field"],
            "min_score": payload["min_score"],
            "ukt": payload["ukt"],
            "ukt_min": payload["ukt_min"],
            "ukt_max": payload["ukt_max"],
        },
    }, 201


def edit_major(payload: dict) -> tuple[dict, int]:
    validation_error = _validate_major_payload(payload, require_id=True)
    if validation_error:
        return validation_error

    try:
        major_id = int(payload["id"])
    except (TypeError, ValueError):
        return {"error": "id must be an integer."}, 400

    if get_major_by_id(major_id) is None:
        return {"error": "Major not found."}, 404

    try:
        update_major(
            major_id,
            payload["slug"],
            payload["name"],
            payload["field"],
            payload["min_score"],
            payload["ukt"],
            payload["ukt_min"],
            payload["ukt_max"],
        )
    except sqlite3.IntegrityError:
        return {"error": "Major slug or name already exists."}, 409

    return {
        "message": "Major updated successfully.",
        "major": {
            "id": major_id,
            "slug": payload["slug"],
            "name": payload["name"],
            "field": payload["field"],
            "min_score": payload["min_score"],
            "ukt": payload["ukt"],
            "ukt_min": payload["ukt_min"],
            "ukt_max": payload["ukt_max"],
        },
    }, 200


def remove_major(payload: dict) -> tuple[dict, int]:
    try:
        major_id = int(payload.get("id"))
    except (TypeError, ValueError):
        return {"error": "id must be an integer."}, 400

    if get_major_by_id(major_id) is None:
        return {"error": "Major not found."}, 404

    delete_major(major_id)
    return {"message": "Major deleted successfully.", "deleted_id": major_id}, 200


def get_major_detail_service(major_slug: str) -> tuple[dict, int]:
    slug = str(major_slug).strip().lower()
    if not slug:
        return {"error": "major slug is required."}, 400

    major = get_major_by_slug(slug)
    if major is None:
        return {"error": "Major not found."}, 404

    return {"major": major}, 200

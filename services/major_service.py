import sqlite3

from models.major_model import create_major, delete_major, get_major_by_id, update_major


def _validate_major_payload(payload: dict, require_id: bool = False) -> tuple[dict, int] | None:
    name = str(payload.get("name", "")).strip()
    min_score = payload.get("min_score")
    ukt = payload.get("ukt")

    if require_id and payload.get("id") is None:
        return {"error": "id is required."}, 400

    if not name:
        return {"error": "name is required."}, 400

    try:
        min_score = float(min_score)
    except (TypeError, ValueError):
        return {"error": "min_score must be a number."}, 400

    try:
        ukt = int(ukt)
    except (TypeError, ValueError):
        return {"error": "ukt must be an integer."}, 400

    if min_score < 0 or min_score > 100:
        return {"error": "min_score must be between 0 and 100."}, 400

    if ukt < 0:
        return {"error": "ukt must be zero or greater."}, 400

    payload["name"] = name
    payload["min_score"] = min_score
    payload["ukt"] = ukt
    return None


def add_major(payload: dict) -> tuple[dict, int]:
    validation_error = _validate_major_payload(payload)
    if validation_error:
        return validation_error

    try:
        major_id = create_major(payload["name"], payload["min_score"], payload["ukt"])
    except sqlite3.IntegrityError:
        return {"error": "Major name already exists."}, 409

    return {
        "message": "Major created successfully.",
        "major": {
            "id": major_id,
            "name": payload["name"],
            "min_score": payload["min_score"],
            "ukt": payload["ukt"],
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
        update_major(major_id, payload["name"], payload["min_score"], payload["ukt"])
    except sqlite3.IntegrityError:
        return {"error": "Major name already exists."}, 409

    return {
        "message": "Major updated successfully.",
        "major": {
            "id": major_id,
            "name": payload["name"],
            "min_score": payload["min_score"],
            "ukt": payload["ukt"],
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

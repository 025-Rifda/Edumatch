import json
import sqlite3

from models.major_catalog import slugify_major_name
from models.major_model import create_major, delete_major, get_all_majors, get_major_by_id, get_major_by_slug, update_major


DEFAULT_MAJOR_DETAIL = {
    "match": 0.0,
    "duration": "8 Semester (4 Tahun)",
    "accreditation": "Baik",
    "total_students": "Data belum tersedia",
    "short_desc": "",
    "description": "",
    "what_you_learn": [],
    "career_prospects": [],
    "why_choose": [],
    "icon": "",
    "color": "",
}


def _parse_json_list(value: object, *, item_type: str = "string") -> list:
    if isinstance(value, list):
        return value

    if isinstance(value, str):
        text = value.strip()
        if not text:
            return []
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            return []
        return parsed if isinstance(parsed, list) else []

    return []


def _serialize_major(major: dict | None) -> dict | None:
    if major is None:
        return None

    serialized = dict(major)
    serialized["match"] = float(serialized.get("match") or 0)
    serialized["duration"] = str(serialized.get("duration") or DEFAULT_MAJOR_DETAIL["duration"]).strip()
    serialized["accreditation"] = str(serialized.get("accreditation") or DEFAULT_MAJOR_DETAIL["accreditation"]).strip()
    serialized["total_students"] = str(serialized.get("total_students") or DEFAULT_MAJOR_DETAIL["total_students"]).strip()
    serialized["short_desc"] = str(serialized.get("short_desc") or "").strip()
    serialized["description"] = str(serialized.get("description") or "").strip()
    serialized["what_you_learn"] = _parse_json_list(serialized.get("what_you_learn"))
    serialized["career_prospects"] = _parse_json_list(serialized.get("career_prospects"), item_type="object")
    serialized["why_choose"] = _parse_json_list(serialized.get("why_choose"))
    serialized["icon"] = str(serialized.get("icon") or "").strip()
    serialized["color"] = str(serialized.get("color") or "").strip()
    return serialized


def serialize_major_list(majors: list[dict]) -> list[dict]:
    return [_serialize_major(major) for major in majors if major is not None]


def _validate_string_list(value: object, field_name: str) -> tuple[list[str] | None, tuple[dict, int] | None]:
    if not isinstance(value, list) or not value:
        return None, ({"error": f"{field_name} must be a non-empty array."}, 400)

    normalized_items: list[str] = []
    for item in value:
        text = str(item or "").strip()
        if not text:
            return None, ({"error": f"Each item in {field_name} must be a non-empty string."}, 400)
        normalized_items.append(text)

    return normalized_items, None


def _validate_career_prospects(value: object) -> tuple[list[dict] | None, tuple[dict, int] | None]:
    if not isinstance(value, list) or not value:
        return None, ({"error": "career_prospects must be a non-empty array."}, 400)

    normalized_items: list[dict] = []
    for item in value:
        if not isinstance(item, dict):
            return None, ({"error": "Each career prospect must be an object."}, 400)

        title = str(item.get("title") or "").strip()
        salary = str(item.get("salary") or "").strip()
        if not title or not salary:
            return None, ({"error": "Each career prospect must include non-empty title and salary."}, 400)

        normalized_items.append({"title": title, "salary": salary})

    return normalized_items, None


def _validate_major_payload(payload: dict, require_id: bool = False) -> tuple[dict, int] | None:
    name = str(payload.get("name", "")).strip()
    slug = str(payload.get("slug", slugify_major_name(name))).strip().lower()
    field = str(payload.get("field", "")).strip() or "Soshum"
    min_score = payload.get("min_score", payload.get("minScore"))
    ukt_min = payload.get("ukt_min", payload.get("uktMin", payload.get("ukt")))
    ukt_max = payload.get("ukt_max", payload.get("uktMax", payload.get("ukt")))
    match = payload.get("match", 0)
    duration = str(payload.get("duration", DEFAULT_MAJOR_DETAIL["duration"])).strip()
    accreditation = str(payload.get("accreditation", DEFAULT_MAJOR_DETAIL["accreditation"])).strip()
    total_students = str(payload.get("total_students", payload.get("totalStudents", DEFAULT_MAJOR_DETAIL["total_students"]))).strip()
    short_desc = str(payload.get("short_desc", payload.get("shortDesc", ""))).strip()
    description = str(payload.get("description", "")).strip()
    icon = str(payload.get("icon", "")).strip()
    color = str(payload.get("color", "")).strip()

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

    try:
        match = float(match)
    except (TypeError, ValueError):
        return {"error": "match must be a number."}, 400

    if min_score < 0 or min_score > 100:
        return {"error": "min_score must be between 0 and 100."}, 400

    if match < 0 or match > 100:
        return {"error": "match must be between 0 and 100."}, 400

    if ukt_min < 0 or ukt_max < 0:
        return {"error": "ukt_min and ukt_max must be zero or greater."}, 400

    if ukt_min > ukt_max:
        return {"error": "ukt_max must be greater than or equal to ukt_min."}, 400

    if not duration:
        return {"error": "duration is required."}, 400

    if not accreditation:
        return {"error": "accreditation is required."}, 400

    if not total_students:
        return {"error": "total_students is required."}, 400

    if not description:
        return {"error": "description is required."}, 400

    what_you_learn, list_error = _validate_string_list(
        payload.get("what_you_learn", payload.get("whatYouLearn")),
        "what_you_learn",
    )
    if list_error:
        return list_error

    why_choose, list_error = _validate_string_list(
        payload.get("why_choose", payload.get("whyChoose")),
        "why_choose",
    )
    if list_error:
        return list_error

    career_prospects, career_error = _validate_career_prospects(
        payload.get("career_prospects", payload.get("careerProspects")),
    )
    if career_error:
        return career_error

    payload["slug"] = slug
    payload["name"] = name
    payload["field"] = field
    payload["min_score"] = min_score
    payload["ukt_min"] = ukt_min
    payload["ukt_max"] = ukt_max
    payload["ukt"] = ukt_max
    payload["match"] = match
    payload["duration"] = duration
    payload["accreditation"] = accreditation
    payload["total_students"] = total_students
    payload["short_desc"] = short_desc or description[:160]
    payload["description"] = description
    payload["what_you_learn"] = what_you_learn
    payload["career_prospects"] = career_prospects
    payload["why_choose"] = why_choose
    payload["icon"] = icon
    payload["color"] = color
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
            payload["match"],
            payload["duration"],
            payload["accreditation"],
            payload["total_students"],
            payload["short_desc"],
            payload["description"],
            json.dumps(payload["what_you_learn"]),
            json.dumps(payload["career_prospects"]),
            json.dumps(payload["why_choose"]),
            payload["icon"],
            payload["color"],
        )
    except sqlite3.IntegrityError:
        return {"error": "Major slug or name already exists."}, 409

    major = _serialize_major(
        {
            "id": major_id,
            "slug": payload["slug"],
            "name": payload["name"],
            "field": payload["field"],
            "min_score": payload["min_score"],
            "ukt": payload["ukt"],
            "ukt_min": payload["ukt_min"],
            "ukt_max": payload["ukt_max"],
            "match": payload["match"],
            "duration": payload["duration"],
            "accreditation": payload["accreditation"],
            "total_students": payload["total_students"],
            "short_desc": payload["short_desc"],
            "description": payload["description"],
            "what_you_learn": payload["what_you_learn"],
            "career_prospects": payload["career_prospects"],
            "why_choose": payload["why_choose"],
            "icon": payload["icon"],
            "color": payload["color"],
        }
    )

    return {"message": "Major created successfully.", "major": major}, 201


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
            payload["match"],
            payload["duration"],
            payload["accreditation"],
            payload["total_students"],
            payload["short_desc"],
            payload["description"],
            json.dumps(payload["what_you_learn"]),
            json.dumps(payload["career_prospects"]),
            json.dumps(payload["why_choose"]),
            payload["icon"],
            payload["color"],
        )
    except sqlite3.IntegrityError:
        return {"error": "Major slug or name already exists."}, 409

    updated_major = _serialize_major(get_major_by_id(major_id))
    return {"message": "Major updated successfully.", "major": updated_major}, 200


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

    major = _serialize_major(get_major_by_slug(slug))
    if major is None:
        return {"error": "Major not found."}, 404

    return {"major": major}, 200


def get_all_major_details_service() -> tuple[dict, int]:
    majors = serialize_major_list(get_all_majors())
    return {"majors": majors, "total_count": len(majors)}, 200

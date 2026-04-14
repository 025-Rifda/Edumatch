import json
from statistics import mean

from models.major_model import get_all_majors
from models.result_model import create_result
from models.user_model import get_user_by_id


def recommend_majors(payload: dict) -> tuple[dict, int]:
    try:
        user_id = int(payload.get("user_id"))
    except (TypeError, ValueError):
        return {"error": "user_id must be an integer."}, 400

    if get_user_by_id(user_id) is None:
        return {"error": "User not found."}, 404

    academic_scores = payload.get("academic_scores")
    interest_scores = payload.get("interest_scores", payload.get("interest_answers"))
    budget = payload.get("budget")

    academic_validation = _validate_academic_scores(academic_scores)
    if academic_validation is not None:
        return academic_validation, 400

    interest_validation = _validate_interest_scores(interest_scores)
    if interest_validation is not None:
        return interest_validation, 400

    try:
        budget = int(budget)
    except (TypeError, ValueError):
        return {"error": "budget must be an integer."}, 400

    if budget <= 0:
        return {"error": "budget must be greater than zero."}, 400

    academic_score = calculate_academic_score(academic_scores)
    interest_score, _ = calculate_interest_score(interest_scores)
    eligible_majors = filter_majors_by_budget(get_all_majors(), budget)

    ranked_majors = rank_majors(
        majors=eligible_majors,
        academic_score=academic_score,
        interest_score=interest_score,
        budget=budget,
    )

    result_payload = {
        "top3": ranked_majors[:3],
        "top10": ranked_majors[:10],
    }

    create_result(user_id, json.dumps(result_payload))
    return result_payload, 200


def calculate_academic_score(academic_scores: dict[str, float]) -> float:
    average_score = mean(float(score) for score in academic_scores.values())
    category = classify_academic_score(average_score)

    if category == "high":
        return 100.0
    if category == "medium":
        return 75.0
    return 50.0


def classify_academic_score(score: float) -> str:
    if score > 85:
        return "high"
    if 70 <= score <= 85:
        return "medium"
    return "low"


def calculate_interest_score(interest_scores: list[float | int]) -> tuple[float, dict[str, float]]:
    average_interest = mean(float(score) for score in interest_scores)
    interest_0_to_100 = convert_interest_to_100_scale(average_interest)
    membership = calculate_fuzzy_membership(interest_0_to_100)
    score = defuzzify_interest(membership)
    return round(score, 2), membership


def convert_interest_to_100_scale(score: float) -> float:
    return ((score - 1) / 4) * 100


def calculate_fuzzy_membership(score_0_to_100: float) -> dict[str, float]:
    if score_0_to_100 <= 50:
        low = (50 - score_0_to_100) / 50
    else:
        low = 0.0

    if score_0_to_100 <= 50:
        medium = score_0_to_100 / 50
    else:
        medium = (100 - score_0_to_100) / 50
    medium = max(0.0, medium)

    if score_0_to_100 >= 50:
        high = (score_0_to_100 - 50) / 50
    else:
        high = 0.0

    return {
        "low": round(max(0.0, min(1.0, low)), 4),
        "medium": round(max(0.0, min(1.0, medium)), 4),
        "high": round(max(0.0, min(1.0, high)), 4),
    }


def defuzzify_interest(membership: dict[str, float]) -> float:
    numerator = (
        membership["low"] * 30
        + membership["medium"] * 70
        + membership["high"] * 100
    )
    denominator = membership["low"] + membership["medium"] + membership["high"]
    if denominator == 0:
        return 0.0
    return numerator / denominator


def filter_majors_by_budget(majors: list[dict], budget: int) -> list[dict]:
    return [major for major in majors if int(major["ukt"]) <= budget]


def calculate_financial_match(major_ukt: int, budget: int) -> float:
    if major_ukt > budget:
        return 0.0
    return round((major_ukt / budget) * 100, 2)


def rank_majors(
    majors: list[dict],
    academic_score: float,
    interest_score: float,
    budget: int,
) -> list[dict]:
    ranked = []

    for major in majors:
        financial_match = calculate_financial_match(int(major["ukt"]), budget)
        adjusted_academic = calculate_major_academic_fit(
            academic_score=academic_score,
            major_min_score=float(major["min_score"]),
        )
        final_score = (
            (adjusted_academic * 0.40)
            + (interest_score * 0.40)
            + (financial_match * 0.20)
        )

        ranked.append(
            {
                "id": major["id"],
                "name": major["name"],
                "percentage": round(final_score, 2),
                "match": round(final_score, 2),
                "academic_score": round(adjusted_academic, 2),
                "interest_score": round(interest_score, 2),
                "financial_match": financial_match,
                "min_score": float(major["min_score"]),
                "ukt": int(major["ukt"]),
            }
        )

    ranked.sort(key=lambda major: (-major["percentage"], major["ukt"], major["name"]))
    return ranked


def calculate_major_academic_fit(academic_score: float, major_min_score: float) -> float:
    if academic_score >= major_min_score:
        return 100.0
    return round((academic_score / major_min_score) * 100, 2)


def _validate_academic_scores(academic_scores: object) -> dict | None:
    if not isinstance(academic_scores, dict) or not academic_scores:
        return {"error": "academic_scores must be a non-empty object."}

    for subject, score in academic_scores.items():
        try:
            numeric_score = float(score)
        except (TypeError, ValueError):
            return {"error": f"Academic score for '{subject}' must be numeric."}

        if numeric_score < 0 or numeric_score > 100:
            return {"error": f"Academic score for '{subject}' must be between 0 and 100."}

    return None


def _validate_interest_scores(interest_scores: object) -> dict | None:
    if not isinstance(interest_scores, list) or not interest_scores:
        return {"error": "interest_scores must be a non-empty array."}

    for score in interest_scores:
        try:
            numeric_score = float(score)
        except (TypeError, ValueError):
            return {"error": "Each interest score must be numeric."}

        if numeric_score < 1 or numeric_score > 5:
            return {"error": "Each interest score must be between 1 and 5."}

    return None

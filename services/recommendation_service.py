import json
from statistics import mean

from models.major_catalog import slugify_major_name
from models.major_model import get_all_majors
from models.result_model import create_result
from models.user_model import get_user_by_id

COMMON_ACADEMIC_SUBJECTS = {"matematika", "indonesia", "inggris"}
JURUSAN_ACADEMIC_SUBJECTS = {
    "IPA": {"fisika", "kimia", "biologi"},
    "IPS": {"geografi", "sosiologi", "ekonomi"},
}
SCHOOL_TRACK_TO_FIELD = {
    "IPA": "Saintek",
    "IPS": "Soshum",
}

INTEREST_DIMENSION_LABELS = {
    "technology": "teknologi",
    "analysis": "analisis",
    "business": "bisnis",
    "social": "interaksi sosial",
    "health": "kesehatan",
    "science": "sains",
    "creativity": "kreativitas",
    "theory": "pemahaman teori",
    "education": "pendidikan",
    "communication": "komunikasi",
    "detail": "ketelitian",
    "leadership": "kepemimpinan",
}

INTEREST_DIMENSION_QUESTIONS = {
    "technology": [0, 11],
    "analysis": [1, 10, 14, 19],
    "business": [2, 18],
    "social": [3, 13],
    "health": [4],
    "science": [5],
    "creativity": [6, 16],
    "theory": [7, 15],
    "education": [8],
    "communication": [9, 12],
    "detail": [17],
    "leadership": [18],
}

DEFAULT_FIELD_PROFILES = {
    "Saintek": {
        "dimensions": {
            "analysis": 0.25,
            "science": 0.25,
            "technology": 0.20,
            "detail": 0.15,
            "health": 0.15,
        },
        "preferred_subjects": ["matematika", "inggris", "fisika", "kimia", "biologi"],
    },
    "Soshum": {
        "dimensions": {
            "communication": 0.20,
            "social": 0.20,
            "business": 0.20,
            "analysis": 0.15,
            "education": 0.10,
            "leadership": 0.15,
        },
        "preferred_subjects": ["matematika", "indonesia", "inggris", "geografi", "sosiologi", "ekonomi"],
    },
}

MAJOR_RECOMMENDATION_PROFILES = {
    "manajemen": {
        "dimensions": {"business": 0.35, "leadership": 0.20, "communication": 0.15, "social": 0.10, "analysis": 0.10, "detail": 0.10},
        "preferred_subjects": ["matematika", "indonesia", "inggris", "ekonomi", "sosiologi"],
    },
    "psikologi": {
        "dimensions": {"social": 0.25, "communication": 0.20, "theory": 0.15, "analysis": 0.10, "education": 0.10, "health": 0.10, "detail": 0.10},
        "preferred_subjects": ["indonesia", "inggris", "biologi", "sosiologi"],
    },
    "keperawatan": {
        "dimensions": {"health": 0.35, "social": 0.20, "science": 0.20, "communication": 0.15, "detail": 0.10},
        "preferred_subjects": ["matematika", "inggris", "biologi", "kimia"],
    },
    "akuntansi": {
        "dimensions": {"business": 0.25, "analysis": 0.25, "detail": 0.25, "theory": 0.10, "technology": 0.05, "communication": 0.10},
        "preferred_subjects": ["matematika", "indonesia", "inggris", "ekonomi"],
    },
    "pendidikan-guru-sd": {
        "dimensions": {"education": 0.30, "social": 0.20, "communication": 0.20, "creativity": 0.10, "leadership": 0.10, "theory": 0.10},
        "preferred_subjects": ["indonesia", "inggris", "matematika", "sosiologi"],
    },
    "ilmu-komunikasi": {
        "dimensions": {"communication": 0.35, "creativity": 0.20, "social": 0.15, "leadership": 0.10, "business": 0.10, "technology": 0.10},
        "preferred_subjects": ["indonesia", "inggris", "sosiologi"],
    },
    "bisnis-digital": {
        "dimensions": {"business": 0.30, "technology": 0.20, "creativity": 0.15, "communication": 0.15, "analysis": 0.10, "leadership": 0.10},
        "preferred_subjects": ["matematika", "inggris", "ekonomi", "geografi"],
    },
    "ilmu-hukum": {
        "dimensions": {"communication": 0.25, "theory": 0.20, "analysis": 0.20, "social": 0.15, "leadership": 0.10, "detail": 0.10},
        "preferred_subjects": ["indonesia", "inggris", "sosiologi"],
    },
    "gizi": {
        "dimensions": {"health": 0.25, "science": 0.20, "detail": 0.15, "social": 0.15, "communication": 0.10, "analysis": 0.15},
        "preferred_subjects": ["matematika", "inggris", "biologi", "kimia"],
    },
    "fisioterapi": {
        "dimensions": {"health": 0.30, "science": 0.20, "social": 0.15, "communication": 0.15, "analysis": 0.10, "detail": 0.10},
        "preferred_subjects": ["matematika", "inggris", "biologi", "fisika"],
    },
    "ilmu-administrasi-negara": {
        "dimensions": {"leadership": 0.20, "social": 0.20, "communication": 0.15, "analysis": 0.15, "theory": 0.15, "business": 0.15},
        "preferred_subjects": ["indonesia", "inggris", "geografi", "sosiologi", "ekonomi"],
    },
    "pendidikan-bahasa-dan-sastra-indonesia": {
        "dimensions": {"communication": 0.25, "education": 0.25, "creativity": 0.15, "theory": 0.15, "social": 0.10, "detail": 0.10},
        "preferred_subjects": ["indonesia", "inggris", "sosiologi"],
    },
    "ekonomi": {
        "dimensions": {"business": 0.30, "analysis": 0.25, "theory": 0.15, "communication": 0.10, "leadership": 0.10, "detail": 0.10},
        "preferred_subjects": ["matematika", "indonesia", "inggris", "ekonomi", "geografi"],
    },
    "teknik-informatika": {
        "dimensions": {"technology": 0.35, "analysis": 0.25, "creativity": 0.10, "detail": 0.10, "science": 0.10, "leadership": 0.10},
        "preferred_subjects": ["matematika", "inggris", "fisika"],
    },
    "sosiologi": {
        "dimensions": {"social": 0.35, "theory": 0.20, "communication": 0.15, "analysis": 0.15, "education": 0.05, "creativity": 0.10},
        "preferred_subjects": ["indonesia", "inggris", "sosiologi", "geografi"],
    },
    "sistem-informasi": {
        "dimensions": {"technology": 0.25, "business": 0.25, "analysis": 0.20, "communication": 0.10, "detail": 0.10, "leadership": 0.10},
        "preferred_subjects": ["matematika", "inggris", "fisika", "ekonomi"],
    },
    "teknologi-pangan-dan-hasil-pertanian": {
        "dimensions": {"science": 0.25, "health": 0.15, "analysis": 0.15, "detail": 0.15, "technology": 0.10, "business": 0.10, "creativity": 0.10},
        "preferred_subjects": ["matematika", "inggris", "kimia", "biologi"],
    },
    "teknik-sipil": {
        "dimensions": {"analysis": 0.25, "science": 0.20, "technology": 0.15, "detail": 0.15, "leadership": 0.10, "creativity": 0.05, "business": 0.10},
        "preferred_subjects": ["matematika", "inggris", "fisika"],
    },
    "bimbingan-dan-konseling": {
        "dimensions": {"social": 0.30, "communication": 0.25, "education": 0.20, "theory": 0.10, "health": 0.05, "leadership": 0.10},
        "preferred_subjects": ["indonesia", "inggris", "sosiologi"],
    },
    "kedokteran": {
        "dimensions": {"health": 0.35, "science": 0.25, "analysis": 0.15, "detail": 0.15, "social": 0.10},
        "preferred_subjects": ["matematika", "inggris", "biologi", "kimia"],
    },
}


def recommend_majors(payload: dict) -> tuple[dict, int]:
    print(
        "[recommend_majors] Incoming payload:",
        {
            "user_id": payload.get("user_id"),
            "academic_score_keys": sorted((payload.get("academic_scores") or {}).keys()) if isinstance(payload.get("academic_scores"), dict) else None,
            "interest_answer_count": len(payload.get("interest_scores", payload.get("interest_answers")) or []) if isinstance(payload.get("interest_scores", payload.get("interest_answers")), list) else None,
            "budget": payload.get("budget"),
        },
    )

    try:
        user_id = int(payload.get("user_id"))
    except (TypeError, ValueError):
        print("[recommend_majors] Invalid user_id:", payload.get("user_id"))
        return {"error": "user_id must be an integer."}, 400

    user = get_user_by_id(user_id)
    if user is None:
        print("[recommend_majors] User not found:", user_id)
        return {"error": "User not found."}, 404

    user_jurusan = _normalize_jurusan(user.get("jurusan"))
    if user_jurusan is None:
        print("[recommend_majors] Invalid jurusan for user:", user)
        return {"error": "User jurusan is invalid."}, 400

    academic_scores = payload.get("academic_scores")
    interest_scores = payload.get("interest_scores", payload.get("interest_answers"))
    budget = payload.get("budget")

    normalized_academic_scores, academic_validation = _validate_academic_scores(
        academic_scores=academic_scores,
        jurusan=user_jurusan,
    )
    if academic_validation is not None or normalized_academic_scores is None:
        print("[recommend_majors] Academic validation failed:", academic_validation)
        return academic_validation or {"error": "academic_scores is invalid."}, 400

    interest_validation = _validate_interest_scores(interest_scores)
    if interest_validation is not None:
        print("[recommend_majors] Interest validation failed:", interest_validation)
        return interest_validation, 400

    try:
        budget = int(budget)
    except (TypeError, ValueError):
        print("[recommend_majors] Invalid budget:", budget)
        return {"error": "budget must be an integer."}, 400

    if budget <= 0:
        print("[recommend_majors] Non-positive budget:", budget)
        return {"error": "budget must be greater than zero."}, 400

    interest_profile = calculate_interest_profile(interest_scores)
    overall_interest_score, _ = calculate_interest_score(interest_scores)
    all_majors = get_all_majors()
    budget_metadata = summarize_budget_status(all_majors, budget)

    print(
        "[recommend_majors] Validation passed.",
        {
            "user_id": user_id,
            "user_jurusan": user_jurusan,
            "academic_subject_count": len(normalized_academic_scores),
            "interest_dimensions": interest_profile,
            "overall_interest_score": overall_interest_score,
            "strict_budget_match_count": budget_metadata["strict_budget_match_count"],
            "eligible_majors_count": len(all_majors),
            "used_budget_fallback": budget_metadata["used_budget_fallback"],
        },
    )

    ranked_majors = rank_majors(
        majors=all_majors,
        academic_scores=normalized_academic_scores,
        interest_profile=interest_profile,
        overall_interest_score=overall_interest_score,
        budget=budget,
        user_jurusan=user_jurusan,
    )

    result_payload = {
        "top3": ranked_majors[:3],
        "top10": ranked_majors[:10],
        "meta": {
            "budget": budget,
            "total_ranked": len(ranked_majors),
            **budget_metadata,
        },
    }

    print(
        "[recommend_majors] Ranked majors ready:",
        {
            "top3": [major["slug"] for major in ranked_majors[:3]],
            "top10_count": min(len(ranked_majors), 10),
        },
    )

    try:
        create_result(user_id, json.dumps(result_payload))
    except Exception as error:
        print("[recommend_majors] Failed to persist result history:", repr(error))
        result_payload["meta"]["history_persist_error"] = str(error)

    return result_payload, 200


def calculate_academic_score(academic_scores: dict[str, float]) -> float:
    return mean(float(score) for score in academic_scores.values())


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


def summarize_budget_status(majors: list[dict], budget: int) -> dict:
    affordable_majors = [
        major
        for major in majors
        if int(major.get("ukt_min", major["ukt"])) <= budget
    ]

    if affordable_majors:
        print(
            "[summarize_budget_status] Affordable majors found.",
            {
                "budget": budget,
                "count": len(affordable_majors),
            },
        )
        return {
            "strict_budget_match_count": len(affordable_majors),
            "used_budget_fallback": False,
            "budget_message": None,
            "affordable_major_count": len(affordable_majors),
            "unaffordable_major_count": max(0, len(majors) - len(affordable_majors)),
        }

    print(
        "[summarize_budget_status] No affordable majors found.",
        {
            "budget": budget,
            "major_count": len(majors),
        },
    )
    return {
        "strict_budget_match_count": 0,
        "used_budget_fallback": True,
        "budget_message": "Tidak ada jurusan yang sesuai UKT pada budget ini. Sistem tetap menampilkan ranking Top 10 terbaik dan menandai jurusan yang berada di luar UKT.",
        "affordable_major_count": 0,
        "unaffordable_major_count": len(majors),
    }


def get_ukt_status(major_ukt_min: int, budget: int) -> tuple[bool, str]:
    is_affordable = budget >= major_ukt_min
    return is_affordable, "Sesuai UKT" if is_affordable else "Di luar UKT"


def calculate_financial_match(major_ukt_min: int, major_ukt_max: int, budget: int) -> float:
    if budget < major_ukt_min:
        return round(max(0.0, min(60.0, (budget / major_ukt_min) * 60)), 2)

    if budget <= major_ukt_max:
        return 100.0

    overshoot_ratio = (budget - major_ukt_max) / budget if budget else 0.0
    return round(max(70.0, 100 - (overshoot_ratio * 30)), 2)


def rank_majors(
    majors: list[dict],
    academic_scores: dict[str, float],
    interest_profile: dict[str, float],
    overall_interest_score: float,
    budget: int,
    user_jurusan: str,
) -> list[dict]:
    ranked = []

    for major in majors:
        profile = get_major_recommendation_profile(major)
        field = major.get("field", "Soshum")
        major_ukt_min = int(major.get("ukt_min", major["ukt"]))
        major_ukt_max = int(major.get("ukt_max", major["ukt"]))
        is_affordable, ukt_status = get_ukt_status(major_ukt_min, budget)

        financial_match = calculate_financial_match(major_ukt_min, major_ukt_max, budget)
        major_interest_fit = calculate_major_interest_fit(
            interest_profile=interest_profile,
            overall_interest_score=overall_interest_score,
            profile=profile,
        )
        academic_readiness, academic_details = calculate_major_academic_readiness(
            academic_scores=academic_scores,
            preferred_subjects=profile["preferred_subjects"],
        )
        academic_support = calculate_major_academic_fit(
            academic_score=academic_readiness,
            major_min_score=float(major["min_score"]),
        )
        final_score = (
            (major_interest_fit * 0.55)
            + (academic_support * 0.30)
            + (financial_match * 0.15)
        )

        is_cross_track = SCHOOL_TRACK_TO_FIELD.get(user_jurusan) != field
        confidence = determine_recommendation_confidence(
            interest_fit=major_interest_fit,
            academic_support=academic_support,
            coverage_ratio=academic_details["coverage_ratio"],
        )

        ranked.append(
            {
                "id": major["id"],
                "slug": major.get("slug"),
                "name": major["name"],
                "percentage": round(final_score, 2),
                "match": round(final_score, 2),
                "interest_score": round(major_interest_fit, 2),
                "academic_score": round(academic_support, 2),
                "academic_readiness": round(academic_readiness, 2),
                "financial_match": financial_match,
                "min_score": float(major["min_score"]),
                "ukt": major_ukt_max,
                "ukt_min": major_ukt_min,
                "ukt_max": major_ukt_max,
                "field": field,
                "confidence": confidence,
                "is_cross_track": is_cross_track,
                "is_budget_safe": is_affordable,
                "is_affordable": is_affordable,
                "sesuai_ukt": is_affordable,
                "ukt_status": ukt_status,
                "reasons": build_recommendation_reasons(
                    major=major,
                    profile=profile,
                    interest_profile=interest_profile,
                    interest_fit=major_interest_fit,
                    academic_support=academic_support,
                    academic_details=academic_details,
                    financial_match=financial_match,
                    budget=budget,
                    user_jurusan=user_jurusan,
                    is_cross_track=is_cross_track,
                    confidence=confidence,
                ),
            }
        )

    ranked.sort(key=lambda major: (-major["percentage"], -major["interest_score"], major["ukt"], major["name"]))
    return ranked


def calculate_major_academic_fit(academic_score: float, major_min_score: float) -> float:
    if academic_score >= major_min_score:
        return 100.0
    return round((academic_score / major_min_score) * 100, 2)


def calculate_interest_profile(interest_scores: list[float | int]) -> dict[str, float]:
    return {
        dimension: calculate_dimension_score(interest_scores, indexes)
        for dimension, indexes in INTEREST_DIMENSION_QUESTIONS.items()
    }


def calculate_dimension_score(interest_scores: list[float | int], indexes: list[int]) -> float:
    dimension_values = [
        convert_interest_to_100_scale(float(interest_scores[index]))
        for index in indexes
        if index < len(interest_scores)
    ]
    if not dimension_values:
        return 0.0
    return round(mean(dimension_values), 2)


def get_major_recommendation_profile(major: dict) -> dict:
    major_slug = str(major.get("slug") or slugify_major_name(str(major["name"])))
    profile = MAJOR_RECOMMENDATION_PROFILES.get(major_slug)
    if profile is not None:
        return profile
    return DEFAULT_FIELD_PROFILES.get(str(major.get("field", "Soshum")), DEFAULT_FIELD_PROFILES["Soshum"])


def calculate_major_interest_fit(
    interest_profile: dict[str, float],
    overall_interest_score: float,
    profile: dict,
) -> float:
    weighted_total = 0.0
    total_weight = 0.0

    for dimension, weight in profile["dimensions"].items():
        weighted_total += interest_profile.get(dimension, 0.0) * weight
        total_weight += weight

    if total_weight == 0:
        return round(overall_interest_score, 2)

    profile_fit = weighted_total / total_weight
    return round((profile_fit * 0.75) + (overall_interest_score * 0.25), 2)


def calculate_major_academic_readiness(
    academic_scores: dict[str, float],
    preferred_subjects: list[str],
) -> tuple[float, dict[str, float | list[str]]]:
    core_avg = mean(academic_scores[subject] for subject in sorted(COMMON_ACADEMIC_SUBJECTS))

    available_preferred_subjects = [
        subject for subject in preferred_subjects if subject in academic_scores
    ]
    available_preferred_scores = [
        academic_scores[subject] for subject in available_preferred_subjects
    ]
    preferred_avg = mean(available_preferred_scores) if available_preferred_scores else core_avg

    track_subjects = [
        subject for subject in academic_scores
        if subject not in COMMON_ACADEMIC_SUBJECTS
    ]
    track_avg = mean(academic_scores[subject] for subject in track_subjects) if track_subjects else core_avg

    coverage_ratio = (
        len(available_preferred_subjects) / len(preferred_subjects)
        if preferred_subjects
        else 1.0
    )
    missing_subject_penalty = (1 - coverage_ratio) * 12

    readiness_score = (
        (core_avg * 0.35)
        + (preferred_avg * 0.45)
        + (track_avg * 0.20)
        - missing_subject_penalty
    )

    return round(max(0.0, readiness_score), 2), {
        "coverage_ratio": round(coverage_ratio, 2),
        "missing_subject_penalty": round(missing_subject_penalty, 2),
        "available_preferred_subjects": available_preferred_subjects,
    }


def determine_recommendation_confidence(
    interest_fit: float,
    academic_support: float,
    coverage_ratio: float,
) -> str:
    if interest_fit >= 85 and academic_support >= 90 and coverage_ratio >= 0.75:
        return "high"
    if interest_fit >= 75 and academic_support >= 75:
        return "medium"
    return "exploratory"


def build_recommendation_reasons(
    major: dict,
    profile: dict,
    interest_profile: dict[str, float],
    interest_fit: float,
    academic_support: float,
    academic_details: dict[str, float | list[str]],
    financial_match: float,
    budget: int,
    user_jurusan: str,
    is_cross_track: bool,
    confidence: str,
) -> list[str]:
    reasons = []
    top_dimensions = get_top_interest_dimensions(
        interest_profile=interest_profile,
        profile_dimensions=profile["dimensions"],
    )

    if is_cross_track and interest_fit >= 80:
        reasons.append(
            f"Ini rekomendasi linjur karena minatmu kuat pada bidang {', '.join(top_dimensions)}, meskipun asal jurusan sekolahmu {user_jurusan}."
        )
    else:
        reasons.append(
            f"Profil minat dan bakatmu paling dekat dengan kebutuhan bidang {', '.join(top_dimensions)} pada jurusan {major['name']}."
        )

    if academic_support >= 95:
        reasons.append("Nilai akademikmu sangat mendukung tuntutan dasar jurusan ini.")
    elif academic_support >= 80:
        reasons.append("Nilai akademikmu cukup mendukung, sehingga peluang adaptasimu masih baik.")
    else:
        reasons.append(
            "Minatmu tetap relevan, tetapi dukungan akademiknya belum terlalu kuat sehingga jurusan ini lebih cocok sebagai opsi eksploratif."
        )

    coverage_ratio = float(academic_details["coverage_ratio"])
    if coverage_ratio < 1:
        reasons.append(
            "Sebagian mata pelajaran pendukung utama tidak ada di jalur sekolahmu saat ini, jadi confidence rekomendasi dibuat lebih hati-hati."
        )

    major_ukt_min = int(major.get("ukt_min", major["ukt"]))
    major_ukt_max = int(major.get("ukt_max", major["ukt"]))
    if major_ukt_min <= budget <= major_ukt_max:
        reasons.append("Kisaran UKT masih sejalan dengan budget yang kamu masukkan.")
    elif budget > major_ukt_max:
        reasons.append("Budgetmu berada di atas kisaran UKT jurusan ini, jadi opsi biaya masih aman.")
    elif financial_match >= 50:
        reasons.append("Kisaran UKT jurusan ini masih mungkin dijangkau, tetapi cukup mendekati batas budgetmu.")
    else:
        reasons.append(
            f"UKT minimum jurusan ini mulai dari Rp {major_ukt_min:,}, jadi kamu mungkin perlu menyiapkan budget tambahan."
        )

    if confidence == "high":
        reasons.append("Confidence rekomendasi ini tinggi karena minat dan kesiapan akademikmu sama-sama kuat.")
    elif confidence == "medium":
        reasons.append("Confidence rekomendasi ini menengah: minatmu kuat dan kesiapan akademikmu cukup baik.")

    return reasons[:4]


def get_top_interest_dimensions(
    interest_profile: dict[str, float],
    profile_dimensions: dict[str, float],
) -> list[str]:
    ranked_dimensions = sorted(
        profile_dimensions,
        key=lambda dimension: (
            -(interest_profile.get(dimension, 0.0) * profile_dimensions[dimension]),
            -interest_profile.get(dimension, 0.0),
        ),
    )
    top_dimensions = [
        INTEREST_DIMENSION_LABELS.get(dimension, dimension)
        for dimension in ranked_dimensions[:2]
    ]
    return top_dimensions or ["umum"]


def _validate_academic_scores(
    academic_scores: object,
    jurusan: str,
) -> tuple[dict[str, float] | None, dict | None]:
    if not isinstance(academic_scores, dict) or not academic_scores:
        return None, {"error": "academic_scores must be a non-empty object."}

    expected_subjects = COMMON_ACADEMIC_SUBJECTS | JURUSAN_ACADEMIC_SUBJECTS[jurusan]
    normalized_scores: dict[str, float] = {}

    for subject, score in academic_scores.items():
        normalized_subject = str(subject).strip().lower()
        if not normalized_subject:
            return None, {"error": "Academic subject name is required."}

        if normalized_subject in normalized_scores:
            return None, {"error": f"Academic subject '{normalized_subject}' is duplicated."}

        try:
            numeric_score = float(score)
        except (TypeError, ValueError):
            return None, {"error": f"Academic score for '{normalized_subject}' must be numeric."}

        if numeric_score < 0 or numeric_score > 100:
            return None, {"error": f"Academic score for '{normalized_subject}' must be between 0 and 100."}

        normalized_scores[normalized_subject] = numeric_score

    submitted_subjects = set(normalized_scores)
    missing_subjects = sorted(expected_subjects - submitted_subjects)
    unexpected_subjects = sorted(submitted_subjects - expected_subjects)

    if missing_subjects or unexpected_subjects:
        error_parts = [f"academic_scores for jurusan {jurusan} must include: {', '.join(sorted(expected_subjects))}."]
        if missing_subjects:
            error_parts.append(f"Missing subjects: {', '.join(missing_subjects)}.")
        if unexpected_subjects:
            error_parts.append(f"Unexpected subjects: {', '.join(unexpected_subjects)}.")
        return None, {"error": " ".join(error_parts)}

    return normalized_scores, None


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


def _normalize_jurusan(value: object) -> str | None:
    normalized_value = str(value or "").strip().upper()
    if normalized_value in JURUSAN_ACADEMIC_SUBJECTS:
        return normalized_value
    return None

from flask import Blueprint, jsonify, request

from services.major_service import get_major_detail_service
from services.recommendation_service import recommend_majors


recommendation_blueprint = Blueprint("recommendation", __name__)


@recommendation_blueprint.post("/recommend")
def recommend():
    response, status_code = recommend_majors(request.get_json(silent=True) or {})
    return jsonify(response), status_code


@recommendation_blueprint.get("/api/majors/<major_slug>")
def get_major_detail(major_slug: str):
    response, status_code = get_major_detail_service(major_slug)
    return jsonify(response), status_code

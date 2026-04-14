from flask import Blueprint, jsonify, request

from services.recommendation_service import recommend_majors


recommendation_blueprint = Blueprint("recommendation", __name__)


@recommendation_blueprint.post("/recommend")
def recommend():
    response, status_code = recommend_majors(request.get_json(silent=True) or {})
    return jsonify(response), status_code

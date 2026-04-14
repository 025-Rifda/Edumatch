from flask import Blueprint, jsonify, request

from services.history_service import fetch_history


history_blueprint = Blueprint("history", __name__)


@history_blueprint.get("/history")
def history():
    user_id = request.args.get("user_id")

    try:
        parsed_user_id = int(user_id)
    except (TypeError, ValueError):
        return jsonify({"error": "user_id query parameter is required and must be an integer."}), 400

    response, status_code = fetch_history(parsed_user_id)
    return jsonify(response), status_code

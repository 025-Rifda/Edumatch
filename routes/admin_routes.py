from flask import Blueprint, jsonify, request

from services.major_service import add_major, edit_major, remove_major
from services.admin_dashboard_service import get_admin_dashboard_stats


admin_blueprint = Blueprint("admin", __name__)


@admin_blueprint.get("/admin/stats")
def admin_stats():
    response, status_code = get_admin_dashboard_stats()
    return jsonify(response), status_code


@admin_blueprint.post("/admin/major")
def create_major():
    response, status_code = add_major(request.get_json(silent=True) or {})
    return jsonify(response), status_code


@admin_blueprint.put("/admin/major")
def update_major():
    response, status_code = edit_major(request.get_json(silent=True) or {})
    return jsonify(response), status_code


@admin_blueprint.delete("/admin/major")
def delete_major():
    response, status_code = remove_major(request.get_json(silent=True) or {})
    return jsonify(response), status_code

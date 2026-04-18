from flask import Blueprint, jsonify, request

from services.major_service import add_major, edit_major, remove_major
from services.admin_dashboard_services import (
    get_admin_dashboard_stats,
    get_admin_user_stats_service,
    get_all_majors_service,
)


admin_blueprint = Blueprint("admin", __name__)


@admin_blueprint.get("/admin/stats")
def admin_stats():
    response, status_code = get_admin_dashboard_stats()
    return jsonify(response), status_code


@admin_blueprint.get("/api/admin/users/stats")
def admin_user_stats():
    response, status_code = get_admin_user_stats_service()
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


@admin_blueprint.get("/admin/majors")
def get_admin_majors():
    response, status_code = get_all_majors_service()
    return jsonify(response), status_code

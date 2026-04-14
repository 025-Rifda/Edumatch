from flask import Blueprint, jsonify, request

from services.auth_service import login_user, register_user


auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.post("/register")
def register():
    response, status_code = register_user(request.get_json(silent=True) or {})
    return jsonify(response), status_code


@auth_blueprint.post("/login")
def login():
    response, status_code = login_user(request.get_json(silent=True) or {})
    return jsonify(response), status_code

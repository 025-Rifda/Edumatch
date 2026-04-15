from werkzeug.security import check_password_hash, generate_password_hash

from models.user_model import create_user, get_user_by_email


ADMIN_EMAILS = {"admin@gmail.com"}


def register_user(payload: dict) -> tuple[dict, int]:
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))
    jurusan = str(payload.get("jurusan", payload.get("major", ""))).strip().upper()

    if not name or not email or not password or not jurusan:
        return {"error": "name, email, password, and jurusan are required."}, 400

    if "@" not in email or "." not in email:
        return {"error": "Invalid email format."}, 400

    if len(password) < 6:
        return {"error": "Password must be at least 6 characters."}, 400

    if jurusan not in {"IPA", "IPS"}:
        return {"error": "jurusan must be IPA or IPS."}, 400

    if get_user_by_email(email):
        return {"error": "Email is already registered."}, 409

    user_id = create_user(name, email, generate_password_hash(password), jurusan)
    return {
        "message": "Registration successful.",
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "jurusan": jurusan,
            "is_admin": email in ADMIN_EMAILS,
        },
    }, 201


def login_user(payload: dict) -> tuple[dict, int]:
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))

    if not email or not password:
        return {"error": "email and password are required."}, 400

    user = get_user_by_email(email)
    if user is None or not check_password_hash(user["password"], password):
        return {"error": "Invalid email or password."}, 401

    return {
        "message": "Login success",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "jurusan": user.get("jurusan", "IPA"),
            "is_admin": user["email"] in ADMIN_EMAILS,
        },
    }, 200

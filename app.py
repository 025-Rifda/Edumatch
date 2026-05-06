import os

from flask import Flask, jsonify
from flask_cors import CORS

from models.database import initialize_database
from routes.admin_routes import admin_blueprint
from routes.auth_routes import auth_blueprint
from routes.history_routes import history_blueprint
from routes.recommendation_routes import recommendation_blueprint


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False
    CORS(app)

    initialize_database()

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(recommendation_blueprint)
    app.register_blueprint(history_blueprint)
    app.register_blueprint(admin_blueprint)

    @app.get("/")
    def healthcheck():
        return jsonify(
            {
                "message": "EduMatch backend is running.",
                "available_endpoints": [
                    "POST /register",
                    "POST /login",
                    "POST /recommend",
                    "GET /api/majors/<slug>",
                    "GET /history?user_id=<id>",
                    "GET /admin/stats",
                    "GET /api/admin/users/stats",
                    "POST /admin/major",
                    "PUT /admin/major",
                    "DELETE /admin/major",
                ],
            }
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )

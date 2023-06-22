import os
import random
import logging

from auth import AuthError, requires_auth
from flask import Flask, request, abort, jsonify, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from models import setup_db, Exercise, db

# Configure logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


def create_app(test_config=None):
    """Create Flask app.

    Args:
        test_config (dict): Configurations of the development environment.

    Returns:
        app (Flask): Flask app.

    """
    app = Flask(__name__)

    if test_config:
        app.config.from_mapping(test_config)
    else:
        config = {
            "SQLALCHEMY_DATABASE_URI": os.environ.get("SQLALCHEMY_DATABASE_URI", None),
            "SQLALCHEMY_TRACK_MODIFICATIONS": os.environ.get(
                "SQLALCHEMY_TRACK_MODIFICATIONS", None
            ),
        }
        app.config.from_mapping(config)

    setup_db(app)
    Migrate(app, db)

    CORS(app)

    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS"
        )
        return response

    @app.route("/exercises")
    @requires_auth("get:exercises")
    def get_exercises(payload):
        logging.info("Processing GET request /exercises")

        """Gets all exercises from the database and returns them as JSON"""
        exercises = Exercise.query.all()

        ids = [exercise.id for exercise in exercises]
        questions = [exercise.question for exercise in exercises]
        answers = [exercise.answer for exercise in exercises]

        return jsonify(
            {
                "success": True,
                "ids": ids,
                "questions": questions,
                "answers": answers,
                "total_exercises": len(exercises),
            }
        )

    @app.route("/exercises/<int:exercise_id>")
    @requires_auth("get:exercise")
    def get_exercise(payload, exercise_id):
        logging.info(f"Processing GET request /exercises/{exercise_id}")

        """Gets a specific exercise from the database and returns it as JSON"""
        exercise = Exercise.query.filter_by(id=exercise_id).one_or_none()

        if exercise is None:
            abort(404)

        question = exercise.question
        answer = exercise.answer

        return jsonify(
            {"success": True, "id": exercise_id, "question": question, "answer": answer}
        )

    @app.route("/exercises/<int:exercise_id>", methods=["PATCH"])
    @requires_auth("patch:exercise")
    def update_exercise(payload, exercise_id):
        logging.info(f"Processing PATCH request /exercises/{exercise_id}")

        """Updates an exercise identified by its ID"""
        exercise = Exercise.query.filter_by(id=exercise_id).one_or_none()

        if exercise is None:
            abort(404)

        body = request.get_json()
        question = body.get("question", None)
        answer = body.get("answer", None)

        if "" in (question, answer):
            abort(422)

        try:
            exercise.question = question
            exercise.answer = answer
            exercise.update()
        except BaseException:
            db.session.rollback()
            abort(500)
        finally:
            db.session.close()

        return jsonify(
            {
                "success": True,
                "question": question,
                "answer": answer,
                "updated_exercise": exercise_id,
            }
        )

    @app.route("/exercises/<int:exercise_id>", methods=["DELETE"])
    @requires_auth("delete:exercise")
    def delete_exercise(payload, exercise_id):
        logging.info(f"Processing DELETE request /exercises/{exercise_id}")

        """Deletes an exercise identified by its ID"""
        exercise = Exercise.query.filter_by(id=exercise_id).one_or_none()

        if exercise is None:
            abort(404)

        try:
            exercise.delete()
        except BaseException:
            db.session.rollback()
            abort(500)
        finally:
            db.session.close()

        return jsonify({"success": True, "deleted_exercise": exercise_id})

    @app.route("/exercises", methods=["POST"])
    @requires_auth("post:exercise")
    def post_exercise(payload):
        logging.info("Processing POST request /exercises")

        """Adds a new exercise to the database"""
        body = request.get_json()
        question = body.get("question", None)
        answer = body.get("answer", None)

        if "" in (question, answer):
            abort(422)

        try:
            exercise_obj = Exercise(question, answer)
            exercise_obj.insert()
        except BaseException:
            db.session.rollback()
            abort(500)
        finally:
            db.session.refresh(exercise_obj)  # Refresh to get the id
            db.session.close()

        return jsonify(
            {
                "success": True,
                "id": exercise_obj.id,
                "question": exercise_obj.question,
                "answer": exercise_obj.answer,
            }
        )

    @app.errorhandler(404)
    def unprocessable(error):
        logging.error("Error 404: resource not found")

        return (
            jsonify({"success": False, "error": 404, "message": "resource not found"}),
            404,
        )

    @app.errorhandler(422)
    def unprocessable(error):
        logging.error("Error 422: unprocessable")
        return (
            jsonify({"success": False, "error": 422, "message": "unprocessable"}),
            422,
        )

    @app.errorhandler(500)
    def unprocessable(error):
        logging.error("Error 500: internal server error")

        return (
            jsonify(
                {"success": False, "error": 500, "message": "internal server error"}
            ),
            500,
        )

    @app.errorhandler(AuthError)
    def unprocessable(ex):
        logging.error(f'AuthError {ex.error["code"]}: {ex.error["description"]}')

        return (
            jsonify(
                {
                    "success": False,
                    "error": ex.error["code"],
                    "message": ex.error["description"],
                }
            ),
            ex.status_code,
        )

    return app


if __name__ == "__main__":
    app = create_app()
    app.run()

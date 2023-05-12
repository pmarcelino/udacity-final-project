import os
import random

from auth import AuthError, requires_auth
from flask import Flask, request, abort, jsonify, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from models import setup_db, Exercise, db


def create_app(test_config=None):
    """Create Flask app.

    Args:
        test_config (dict): Configurations of the development environment.

    Returns:
        app (Flask): Flask app.

    """
    app = Flask(__name__)
    Migrate(app, db)

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

    CORS(app)

    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response

    @app.route("/exercises")
    def get_exercises():
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
    def get_exercise(exercise_id):
        """Gets a specific exercise from the database and returns it as JSON"""
        exercise = Exercise.query.filter_by(id=exercise_id).one_or_none()

        if exercise is None:
            abort(404)

        question = exercise.question
        answer = exercise.answer

        return jsonify(
            {"success": True, "id": exercise_id, "question": question, "answer": answer}
        )

    @app.route("/exercises/<int:exercise_id>", methods=["PUT"])
    @requires_auth("put:exercise")
    def update_exercise(payload, exercise_id):
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
        return (
            jsonify({"success": False, "error": 404, "message": "resource not found"}),
            404,
        )

    @app.errorhandler(422)
    def unprocessable(error):
        return (
            jsonify({"success": False, "error": 422, "message": "unprocessable"}),
            422,
        )

    @app.errorhandler(500)
    def unprocessable(error):
        return (
            jsonify(
                {"success": False, "error": 500, "message": "internal server error"}
            ),
            500,
        )

    @app.errorhandler(AuthError)
    def unprocessable(ex):
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

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey

db = SQLAlchemy()


def setup_db(app):
    db.app = app
    db.init_app(app)
    with app.app_context():
        db.create_all()


class Exercise(db.Model):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True)
    question = Column(String)
    answer = Column(String)
    reviews = db.relationship("Review", back_populates="exercise")

    def __init__(self, question, answer):
        self.question = question
        self.answer = answer

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer}


class Review(db.Model):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    date = Column(DateTime)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    reviewer_id = Column(String)
    exercise = db.relationship("Exercise", back_populates="reviews")

    def __init__(self, date, exercise_id, reviewer_id):
        self.date = date
        self.exercise_id = exercise_id
        self.reviewer_id = reviewer_id

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "date": self.date,
            "exercise_id": self.exercise_id,
            "reviewer_id": self.reviewer_id,
        }

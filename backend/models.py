from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, ForeignKey

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
        return {"id": self.id, "question": self.question, "answer": self.answer}


class User(db.Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    auth0_id = Column(String, unique=True)
    type = Column(String)

    def __init__(self, type):
        self.type = type

    def format(self):
        return {"id": self.id, "email": self.email, "auth0_id": self.auth0_id}

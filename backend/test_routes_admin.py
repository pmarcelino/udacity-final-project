import http.client
import json
import os
import unittest

from app import create_app
from dotenv import load_dotenv

load_dotenv()

AUTH0_CLIENT_ID_TEST_ADMIN = os.environ.get("AUTH0_CLIENT_ID_TEST_ADMIN", None)
AUTH0_CLIENT_SECRET_TEST_ADMIN = os.environ.get("AUTH0_CLIENT_SECRET_TEST_ADMIN", None)
AUTH0_DOMAIN = os.environ.get("AUTH0_DOMAIN", None)
API_AUDIENCE = os.environ.get("API_AUDIENCE", None)


class AppTestCase(unittest.TestCase):
    """This class represents the app test case"""

    def setUp(self):
        """Define test variables and initialize app"""
        self.database_name = "math_test"
        self.database_path = "postgresql://{}/{}".format(
            "localhost:5432", self.database_name
        )
        test_config = {
            "SQLALCHEMY_DATABASE_URI": self.database_path,
            "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        }

        self.app = create_app(test_config)
        self.client = self.app.test_client

        self.token = self.get_token()

        self.message_401 = "unauthorized"
        self.message_403 = "forbidden"
        self.message_404 = "resource not found"
        self.message_422 = "unprocessable"

    def get_token(self):
        headers = {"Content-Type": "application/json"}

        payload = {
            "grant_type": "client_credentials",
            "audience": API_AUDIENCE,
            "client_id": AUTH0_CLIENT_ID_TEST_ADMIN,
            "client_secret": AUTH0_CLIENT_SECRET_TEST_ADMIN,
        }

        conn = http.client.HTTPSConnection(AUTH0_DOMAIN)
        conn.request("POST", "/oauth/token", json.dumps(payload), headers)

        response = conn.getresponse()
        response_data = response.read()

        conn.close()

        token = json.loads(response_data.decode("utf-8"))["access_token"]

        return token

    def tearDown(self):
        """Executed after each test"""
        pass

    def test_get_exercises(self):
        """Test it gets all available exercises"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        status_code = 200

        # When
        res = self.client().get("/exercises", headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["ids"])
        self.assertTrue(data["questions"])
        self.assertTrue(data["answers"])
        self.assertTrue(data["total_exercises"])

    def test_get_exercise(self):
        """Test it gets a specific exercise"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        res = self.client().get("/exercises", headers=headers)
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database

        status_code = 200

        # When
        res = self.client().get(f"/exercises/{exercise_id}", headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["id"])
        self.assertTrue(data["question"])
        self.assertTrue(data["answer"])

    def test_404_get_exercise_invalid_id(self):
        """Test get specific exercise fails when the exercise_id is invalid"""
        # Given
        exercise_id = 999999999
        status_code = 404
        message = self.message_404
        headers = {"Authorization": "Bearer " + self.token}

        # When
        res = self.client().get(f"/exercises/{exercise_id}", headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_delete_exercise(self):
        """Test delete exercise"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        res = self.client().get("/exercises", headers=headers)
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database
        status_code = 200

        # When
        res = self.client().delete(f"/exercises/{exercise_id}", headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["deleted_exercise"], exercise_id)

    def test_404_delete_exercise_invalid_id(self):
        """Test delete exercise fails when the exercise_id is invalid"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        exercise_id = 999999999
        status_code = 404
        message = self.message_404

        # When
        res = self.client().delete(f"/exercises/{exercise_id}", headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_create_exercise(self):
        """Test create exercise"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        question = "Test question"
        answer = "Test answer"

        data = {"question": question, "answer": answer}

        status_code = 200

        # When
        res = self.client().post("/exercises", json=data, headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["question"], question)
        self.assertEqual(data["answer"], answer)

    def test_422_create_exercise_fails_missing_exercise(self):
        """Test create exercise fails when the question is missing"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        question = ""
        answer = "Answer"

        data = {"question": question, "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().post("/exercises", json=data, headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_422_create_exercise_fails_missing_answer(self):
        """Test create exercise fails when the answer is missing"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        question = "Question"
        answer = ""

        data = {"question": question, "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().post("/exercises", json=data, headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_update_exercise(self):
        """Test update exercise"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        res = self.client().get("/exercises", headers=headers)
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database

        question = "New question"
        answer = "New answer"
        data = {"question": question, "answer": answer}

        status_code = 200

        # When
        res = self.client().patch(
            f"/exercises/{exercise_id}", json=data, headers=headers
        )
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["question"], question)
        self.assertEqual(data["answer"], answer)
        self.assertEqual(data["updated_exercise"], exercise_id)

    def test_404_update_exercise_invalid_id(self):
        """Test update exercise fails when the exercise_id is invalid"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        exercise_id = 999999999
        status_code = 404
        message = self.message_404

        # When
        res = self.client().patch(f"/exercises/{exercise_id}", headers=headers)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_422_update_exercise_fails_missing_question(self):
        """Test update exercise fails when the question is missing"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        res = self.client().get("/exercises", headers=headers)
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database

        question = ""
        answer = "Answer"
        data = {"question": question, "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().patch(
            f"/exercises/{exercise_id}", json=data, headers=headers
        )
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_422_update_exercise_fails_missing_answer(self):
        """Test update exercise fails when the answer is missing"""
        # Given
        headers = {"Authorization": "Bearer " + self.token}
        res = self.client().get("/exercises", headers=headers)
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database

        question = "Question"
        answer = ""
        data = {"question": question, "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().patch(
            f"/exercises/{exercise_id}", json=data, headers=headers
        )
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)


if __name__ == "__main__":
    unittest.main()

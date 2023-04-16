import unittest
import json
from app import create_app


class AppTestCase(unittest.TestCase):
    """This class represents the app test case"""

    def setUp(self):
        """Define test variables and initialize app"""
        self.database_name = "math_test"
        self.database_path = "postgresql://{}/{}".format(
            'localhost:5432', self.database_name)
        test_config = {
            'SQLALCHEMY_DATABASE_URI': self.database_path,
            'SQLALCHEMY_TRACK_MODIFICATIONS': False
        }

        self.app = create_app(test_config)
        self.client = self.app.test_client

        self.message_404 = "resource not found"
        self.message_422 = "unprocessable"

    def tearDown(self):
        """Executed after each test"""
        pass
    
    def test_get_exercises(self):
        """Test it gets available exercises"""
        # Given
        status_code = 200
        
        # When
        res = self.client().get("/exercises")
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['ids'])
        self.assertTrue(data['questions'])
        self.assertTrue(data['answers'])
        self.assertTrue(data['total_exercises'])

    def test_delete_exercise(self):
        """Test delete exercise"""
        # Given
        res = self.client().get("/exercises")
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database
        status_code = 200
        
        # When
        res = self.client().delete(f"/exercises/{exercise_id}")
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["deleted_exercise"], exercise_id)

    def test_404_delete_exercise_invalid_id(self):
        """Test delete exercise fails when the exercise_id is invalid"""
        # Given
        exercise_id = 999999999
        status_code = 404
        message = self.message_404

        # When
        res = self.client().delete(f"/questions/{exercise_id}")
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_post_exercise(self):
        """Test post exercise"""
        # Given
        question = "Test question"
        answer = "Test answer"
        
        data = {"question": question,
                "answer": answer}

        status_code = 200

        # When
        res = self.client().post("/exercises", json=data)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], True)
        self.assertEqual(data["question"], question)
        self.assertEqual(data["answer"], answer)

    def test_422_post_exercise_fails_missing_exercise(self):
        """Test post exercise fails when the question is missing"""
        # Given
        question = ""
        answer = "Answer"
        
        data = {"question": question,
                "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().post("/exercises", json=data)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

    def test_422_post_exercise_fails_missing_answer(self):
        """Test post exercise fails when the answer is missing"""
        # Given
        question = "Question"
        answer = ""
        
        data = {"question": question,
                "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().post("/exercises", json=data)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)
        
    def test_update_exercise(self):
        """Test update exercise"""
        # Given
        res = self.client().get("/exercises")
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database
        
        question = "New question"
        answer = "New answer"
        data = {"question": question,
                "answer": answer}
        
        status_code = 200
        
        # When
        res = self.client().put(f"/exercises/{exercise_id}", json=data)
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
        exercise_id = 999999999
        status_code = 404
        message = self.message_404

        # When
        res = self.client().put(f"/exercises/{exercise_id}")
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)
    
    def test_422_update_exercise_fails_missing_question(self):
        """Test update exercise fails when the question is missing"""
        # Given
        res = self.client().get("/exercises")
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database
        
        question = ""
        answer = "Answer"
        data = {"question": question,
                "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().put(f"/exercises/{exercise_id}", json=data)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)
    
    def test_422_update_exercise_fails_missing_answer(self):
        """Test update exercise fails when the answer is missing"""
        # Given
        res = self.client().get("/exercises")
        data = json.loads(res.data)
        exercise_id = data["ids"][-1]  # Get the last exercise in the database
        
        question = "Question"
        answer = ""
        data = {"question": question,
                "answer": answer}

        status_code = 422
        message = self.message_422

        # When
        res = self.client().put(f"/exercises/{exercise_id}", json=data)
        data = json.loads(res.data)

        # Then
        self.assertEqual(res.status_code, status_code)
        self.assertEqual(data["success"], False)
        self.assertEqual(data["message"], message)

if __name__ == "__main__":
    unittest.main()

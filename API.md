# Math App API Documentation

The Math App API provides endpoints to manage exercises in the Math App database. It allows retrieving, creating, updating, and deleting exercises. All responses are returned in JSON format.

## Base URL

The base URL for accessing the API locally is: `http://localhost:5000`. The production link is: `https://api.overfit.study`.

## Authentication

Authentication is required for certain endpoints. The API uses Auth0 for authentication. The authentication process is handled by the `auth` module.

To authenticate requests, include the `Authorization` header with a valid JWT (JSON Web Token) in the format: `Bearer <token>`. Check `README.md` to get the access credentials.

## Endpoints

### Retrieve all exercises

```
GET /exercises
```

Retrieves all exercises from the database.

#### Parameters

None

#### Response

- `ids` (list): List of exercise IDs.
- `questions` (list): List of exercise questions.
- `answers` (list): List of exercise answers.
- `total_exercises` (integer): Total number of exercises.

### Retrieve a specific exercise

```
GET /exercises/<exercise_id>
```

Retrieves a specific exercise from the database.

#### Parameters

- `exercise_id` (integer): ID of the exercise to retrieve.

#### Response

- `id` (integer): Exercise ID.
- `question` (string): Exercise question.
- `answer` (string): Exercise answer.

### Create a new exercise

```
POST /exercises
```

Creates a new exercise in the database.

#### Parameters

- `question` (string): Exercise question.
- `answer` (string): Exercise answer.

#### Response

- `id` (integer): ID of the created exercise.
- `question` (string): Exercise question.
- `answer` (string): Exercise answer.

### Update an existing exercise

```
PATCH /exercises/<exercise_id>
```

Updates an existing exercise in the database.

#### Parameters

- `exercise_id` (integer): ID of the exercise to update.
- `question` (string): Updated exercise question.
- `answer` (string): Updated exercise answer.
- `reviewer_id` (string): ID of the reviewer.

#### Response

- `question` (string): Updated exercise question.
- `answer` (string): Updated exercise answer.
- `updated_exercise` (integer): ID of the updated exercise.

### Delete an exercise

```
DELETE /exercises/<exercise_id>
```

Deletes an exercise from the database.

#### Parameters

- `exercise_id` (integer): ID of the exercise to delete.

#### Response

- `deleted_exercise` (integer): ID of the deleted exercise.

## Error Handling

The API may return the following error responses:

- `401 Unauthorized`: The request requires authentication, but the provided credentials are invalid or missing.
- `403 Forbidden`: The server understands the request but refuses to authorize it.
- `404 Not Found`: The requested resource was not found.
- `422 Unprocessable`: The request was well-formed but could not be processed.
- `500 Internal Server Error`: An unexpected error occurred on the server.

The error responses will include the following fields:

- `success` (boolean): Indicates whether the request was successful.
- `error` (integer): Error code.
- `message` (string): Error message.

## Testing

To ensure the correctness and functionality of the Math App API, you can run the provided tests. These tests are written using the `unittest` library and there are tests for the Admin role ([test_routes_admin.py](./test_routes_admin.py)) and for the User role ([test_routes_user.py](./test_routes_user.py)).

Before running the tests, make sure you have set up the required environment variables (such as `AUTH0_CLIENT_ID_TEST_ADMIN`, `AUTH0_CLIENT_SECRET_TEST_ADMIN`, `AUTH0_DOMAIN`, and `API_AUDIENCE`) in your testing environment or in a `.env` file.

### Admin

To run the tests, execute the following command:

```
$ python test_routes_admin.py
```

The tests cover various API endpoints and verify their expected behavior. Here's an overview of the tests:

- `test_get_exercises`: Tests the retrieval of all available exercises from the `/exercises` endpoint.
- `test_get_exercise`: Tests the retrieval of a specific exercise from the `/exercises/<exercise_id>` endpoint.
- `test_404_get_exercise_invalid_id`: Tests the scenario when attempting to retrieve an exercise with an invalid ID, which should result in a `404 Not Found` error.
- `test_delete_exercise`: Tests the deletion of an exercise from the `/exercises/<exercise_id>` endpoint.
- `test_404_delete_exercise_invalid_id`: Tests the scenario when attempting to delete an exercise with an invalid ID, which should result in a `404 Not Found` error.
- `test_create_exercise`: Tests the creation of a new exercise using the `/exercises` endpoint.
- `test_422_create_exercise_fails_missing_exercise`: Tests the scenario when attempting to create an exercise without providing a question, which should result in a `422 Unprocessable` error.
- `test_422_create_exercise_fails_missing_answer`: Tests the scenario when attempting to create an exercise without providing an answer, which should result in a `422 Unprocessable` error.
- `test_update_exercise`: Tests the updating of an existing exercise using the `/exercises/<exercise_id>` endpoint.
- `test_404_update_exercise_invalid_id`: Tests the scenario when attempting to update an exercise with an invalid ID, which should result in a `404 Not Found` error.
- `test_422_update_exercise_fails_missing_question`: Tests the scenario when attempting to update an exercise without providing a question, which should result in a `422 Unprocessable` error.
- `test_422_update_exercise_fails_missing_answer`: Tests the scenario when attempting to update an exercise without providing an answer, which should result in a `422 Unprocessable` error.

The test results will be displayed in the console, indicating whether each test has passed or failed. If a test fails, additional details will be provided to help diagnose the issue.

### User

To run the tests, execute the following command:

```
$ python test_routes_user.py
```

The tests cover various API endpoints and verify their expected behavior. Here's an overview of the tests:

- `test_get_exercises`: Tests the retrieval of all available exercises from the `/exercises` endpoint.
- `test_get_exercise`: Tests the retrieval of a specific exercise from the `/exercises/<exercise_id>` endpoint.
- `test_404_get_exercise_invalid_id`: Tests the scenario when attempting to retrieve an exercise with an invalid ID, which should result in a `404 Not Found` error.
- `test_403_delete_exercise`: Tests it cannot delete an exercise due to the lack of permissions.
- `test_403_create_exercise`: Tests it cannot create an exercise due to the lack of permissions.
- `test_403_update_exercise`: Tests it cannot update an exercise due to the lack of permissions.

The test results will be displayed in the console, indicating whether each test has passed or failed. If a test fails, additional details will be provided to help diagnose the issue.
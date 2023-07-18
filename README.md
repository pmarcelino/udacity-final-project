# Math App

The Math App is a web application that provides math exercises to users, allowing them to practice and learn different mathematical concepts. Users can also use the app as a flashcard tool to check their answers and reinforce their knowledge. Additionally, the app includes an admin panel for users with administrative access to manage the questions (create, update, delete).

## Features

- Display math exercises for users to solve.
- Check answers and provide immediate feedback.
- Flashcard functionality to help users practice.
- Admin panel for managing questions (add, edit, delete).

## Technologies

The Math App is built using the following technologies:

### Backend

- Flask: A lightweight Python web framework.
- PostgreSQL: A powerful open-source relational database.
- SQLAlchemy: An Object-Relational Mapping (ORM) library for Python.
- Auth0: A platform for implementing authentication and authorization.

### Frontend

- React: A JavaScript library for building user interfaces.
- JavaScript: The programming language for the web.
- HTML: The standard markup language for creating web pages.
- CSS: A stylesheet language for describing the presentation of a document.

## Prerequisites

Before running the Math App, ensure you have the following installed:

- Python 3.x: The programming language used for the backend.
- Node.js: A JavaScript runtime environment required for frontend development.
- PostgreSQL: The chosen database system for storing application data.
## API Documentation

To interact with the Math App programmatically, you can use the Math App API. The API allows you to retrieve, create, update, and delete exercises in the Math App database. You can find the complete API documentation in the [Math App API Documentation](./API.md) file.

Please refer to the API documentation for more details on each API endpoint, request parameters, and response formats.

## Local Setup

To set up and run the Math App locally, follow these steps:

1. Clone the repository: `$ git clone https://github.com/pmarcelino/udacity-final-project.git`
2. Navigate to the project directory: `$ cd udacity-final-project`
3. Go to the backend directory and install the dependencies: `$ pip install -r requirements.txt`
4. Go to the frontend directory and install the dependencies: `$ npm install`
5. Configure environment variables:
   - Rename the `.env.example` file to `.env`.
   - Rename the `.env.docker.example` file to `.env.docker`.
   - Modify the variables inside the `.env` and `.env.docker` files as needed.
6. Run the backend server: `$ python app.py`
7. Run the frontend development server: `$ npm start`
8. Open your browser and visit `http://localhost:3000` to access the Math App.

Another option is to run the Math App through Docker Compose:

1. Navigate to the project directory: `$ cd udacity-final-project`.
2. Do `docker-compose build` (if it is the first time you are running Math App).
3. Do `docker-compose up`.
4. Open your browser and visit `http://localhost:3000` to access the Math App..

## Tests setup

The Math App has a backend test suit. To configure this test suit:

1. Navigate to the backend directory: `$ cd udacity-final-project/backend`.
1. Do `createdb math_test`
1. Do `python test_routes_admin.py` or `python test_routes_user.py` to setup the database (if it is the first time you are running the tests).
1. Do `psql math_test < mock_data.psql` to fill the database with mock data

Then, you can run the tests for the Admin role (`python test_routes_admin.py`) or the User role (`python test_routes_user.py`).

## Usage

You can access the Math App frontend through the link: [https://fusion.overfit.study](https://fusion.overfit.study). The credentials are:

* **Admin**. Email address `admin@math.com`, password `B2UV%rzgTVyE4cD#&T`.
* **User**. Email address `user@math.com`, password `PCRwYhgSH%NQr2FBKB!TSW5e8&uG^kW@`.

The **Admin** role can get, add, update and delete exercises. The **User** role can get exercises.

To access the Math App API, use the link: [https://api.overfit.study](https://api.overfit.study)

Math App was deployed to an AWS EKS cluster using AWS CodePipeline and AWS CodeBuild. It uses an AWS RDS PostgreSQL database.
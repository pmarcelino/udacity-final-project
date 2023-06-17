# Math App

The Math App is a web application that provides math exercises to users, allowing them to practice and learn different mathematical concepts. Users can also use the app as a flashcard tool to check their answers and reinforce their knowledge. Additionally, the app includes an admin panel for users with administrative access to manage the questions.

## Features

- Display math exercises for users to solve.
- Check answers and provide immediate feedback.
- Flashcard feature to help users practice.
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
   - Modify the variables inside the `.env` file as needed.
6. Run the backend server: `$ python app.py`
7. Run the frontend development server: `$ npm start`
8. Open your browser and visit `http://localhost:3000` to access the Math App.

## Configuration

The Math App uses environment variables for configuration. Update the variables in the `.env` file to match your local environment or deployment settings.

## Deployment

For deploying the Math App to a production server, please refer to the deployment guides for Flask and React. Ensure that the necessary environment variables are set on the production server as well.

## Known Issues

There are currently no known issues with the Math App. If you encounter any problems, please report them to the project's issue tracker.

## Resources

No additional resources or references are available at this time.
import React, { useState, useEffect, useContext } from "react";
import ExerciseContext from "./ExerciseContext";

const ExerciseContainer = () => {
  const [exerciseID, setExerciseID] = useState("");
  const [exerciseQuestion, setExerciseQuestion] = useState("");
  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const { selectedExerciseID } = useContext(ExerciseContext);
  const [showAnswer, setShowAnswer] = useState(false);

  // Get random exercise ID from the backend
  useEffect(() => {
    fetch("http://localhost:5000/exercises")
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.ids.length);
        const randomID = data.ids[randomIndex];

        fetch(`http://localhost:5000/exercises/${randomID}`)
          .then((response) => response.json())
          .then((exerciseData) => {
            setExerciseID(exerciseData.id);
            setExerciseQuestion(exerciseData.question);
            setExerciseAnswer(exerciseData.answer);
          });
      });
  }, []);

  // Get specific exercise ID from the backend
  if (selectedExerciseID) {
    fetch(`http://localhost:5000/exercises/${selectedExerciseID}`)
      .then((response) => response.json())
      .then((exerciseData) => {
        setExerciseID(exerciseData.id);
        setExerciseQuestion(exerciseData.question);
        setExerciseAnswer(exerciseData.answer);
      });
  }

  // Go to the next exercise
  const nextQuestion = () => {
    fetch("http://localhost:5000/exercises")
      .then((response) => response.json())
      .then((data) => {
        const nextIndex = data.ids.indexOf(exerciseID) + 1;
        const maxIndex = Math.max(...data.ids) - 1;
        const minIndex = Math.min(...data.ids) - 1;
        const index = nextIndex > maxIndex ? minIndex : nextIndex;
        const nextID = data.ids[index];

        fetch(`http://localhost:5000/exercises/${nextID}`)
          .then((response) => response.json())
          .then((exerciseData) => {
            setExerciseID(exerciseData.id);
            setExerciseQuestion(exerciseData.question);
            setExerciseAnswer(exerciseData.answer);
          });
      });
  };

  // Toggle answer
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="exercise-container">
      <h2>Exercise {exerciseID}</h2>
      <p>{exerciseQuestion}</p>
      {showAnswer && <p>{exerciseAnswer}</p>}
      <div className="container">
        <div className="row">
          <div className="col">
            <button className="btn btn-primary me-2" onClick={toggleAnswer}>
              {showAnswer ? "Hide" : "Show"} Answer
            </button>
            <button className="btn btn-primary" onClick={nextQuestion}>
              Next Question
            </button>
          </div>
        </div>
        {/* Admin-only buttons */}
        <div className="row mt-3">
          <div className="col">
            <button className="btn btn-success me-2">Add</button>
            <button className="btn btn-warning me-2">Edit</button>
            <button className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseContainer;

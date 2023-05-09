import React, { useState, useEffect, useContext } from "react";
import ExerciseContext from "./ExerciseContext";
import { useAuth0 } from "@auth0/auth0-react";
import jwtDecode from "jwt-decode";
import { Popup } from "./Popup";

const ExerciseContainer = () => {
  const [permissions, setPermissions] = useState([]);
  const [exerciseID, setExerciseID] = useState("");
  const [exerciseQuestion, setExerciseQuestion] = useState("");
  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const {
    selectedExerciseID,
    setSelectedExerciseID,
    exerciseIDs,
    setExerciseIDs,
  } = useContext(ExerciseContext);
  const [open, setOpen] = useState(false);

  // Fetch the Access Token and decode the permissions
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const tokenPermissions = decodedToken[`permissions`] || [];
        setPermissions(tokenPermissions);
      } catch (error) {
        console.error("Error fetching Access Token:", error);
      }
    })();
  }, [getAccessTokenSilently]);

  const canDeleteExercise = permissions.includes("delete:exercise");

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
  const nextExercise = () => {
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
            setSelectedExerciseID(exerciseData.id);
          });
      });
  };

  // Delete exercise
  const deleteExercise = async () => {
    const token = await getAccessTokenSilently();

    fetch(`http://localhost:5000/exercises/${exerciseID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error deleting exercise");
        }
        return response.json();
      })
      .then((data) => {
        setExerciseIDs(exerciseIDs.filter((id) => id !== exerciseID));
        nextExercise();
      })
      .catch((error) => {
        console.error("Error deleting exercise:", error);
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
            <button className="btn btn-primary" onClick={nextExercise}>
              Next Question
            </button>
          </div>
        </div>
        {/* Admin-only buttons */}
        <div className="row mt-3">
          <div className="col">
            <button
              className="btn btn-success me-2"
              onClick={() => setOpen(true)}
            >
              Add
            </button>
            {open ? (
              <Popup text="Add Exercise" closePopup={() => setOpen(false)} />
            ) : null}
            <button className="btn btn-warning me-2">Edit</button>
            {canDeleteExercise && (
              <button className="btn btn-danger" onClick={deleteExercise}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseContainer;

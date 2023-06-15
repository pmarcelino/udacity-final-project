import React, { useState, useEffect, useContext, useCallback } from "react";
import ExerciseContext from "./ExerciseContext";
import { useAuth0 } from "@auth0/auth0-react";
import jwtDecode from "jwt-decode";
import { AddExercise } from "./AddExercise";
import { EditExercise } from "./EditExercise";

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
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Fetch the Access Token and decode the permissions
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const tokenPermissions = decodedToken["permissions"] || [];
        setPermissions(tokenPermissions);
      } catch (error) {
        console.error("Error fetching Access Token:", error);
      }
    };

    fetchAccessToken();
  }, [getAccessTokenSilently]);

  const canAddExercise = permissions.includes("post:exercise");
  const canEditExercise = permissions.includes("put:exercise");
  const canDeleteExercise = permissions.includes("delete:exercise");

  // Get random exercise ID from the backend
  useEffect(() => {
    const fetchRandomExercise = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/exercises`
        );
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.ids.length);
        const randomID = data.ids[randomIndex];

        const exerciseResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/exercises/${randomID}`
        );
        const exerciseData = await exerciseResponse.json();

        setExerciseID(exerciseData.id);
        setExerciseQuestion(exerciseData.question);
        setExerciseAnswer(exerciseData.answer);
      } catch (error) {
        console.error("Error fetching random exercise:", error);
      }
    };

    fetchRandomExercise();
  }, []);

  // Get specific exercise ID from the backend
  const fetchSpecificExercise = useCallback(async (selectedExerciseID) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/exercises/${selectedExerciseID}`
      );
      const exerciseData = await response.json();

      setExerciseID(exerciseData.id);
      setExerciseQuestion(exerciseData.question);
      setExerciseAnswer(exerciseData.answer);
    } catch (error) {
      console.error("Error fetching specific exercise:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedExerciseID) {
      fetchSpecificExercise(selectedExerciseID);
    }
  }, [selectedExerciseID, fetchSpecificExercise]);

  // Go to the next exercise
  const nextExercise = useCallback(
    async (nextIndex = null) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/exercises`
        );
        const data = await response.json();

        // If nextIndex wasn't passed, calculate it
        if (nextIndex === null) {
          console.log("here");
          nextIndex = data.ids.indexOf(exerciseID) + 1;
        }

        console.log(nextIndex);

        const maxIndex = data.ids.length - 1;
        const minIndex = 0;
        const index = nextIndex > maxIndex ? minIndex : nextIndex;
        const nextID = data.ids[index];

        const exerciseResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/exercises/${nextID}`
        );
        const exerciseData = await exerciseResponse.json();

        setExerciseID(exerciseData.id);
        setExerciseQuestion(exerciseData.question);
        setExerciseAnswer(exerciseData.answer);
        setSelectedExerciseID(exerciseData.id);
      } catch (error) {
        console.error("Error fetching next exercise:", error);
      }
    },
    [
      exerciseID,
      setExerciseID,
      setExerciseQuestion,
      setExerciseAnswer,
      setSelectedExerciseID,
    ]
  );

  // Add exercise
  const addExercise = (newExercise) => {
    setExerciseIDs([...exerciseIDs, newExercise.id]);
    setSelectedExerciseID(newExercise.id);
  };

  // Edit exercise
  const editExercise = (editedExercise) => {
    setExerciseQuestion(editedExercise.question);
    setExerciseAnswer(editedExercise.answer);
  };

  // Delete exercise
  const deleteExercise = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();

      // Save the nextIndex before deleting the current exercise
      const responseBeforeDelete = await fetch(
        `${process.env.REACT_APP_API_URL}/exercises`
      );
      const dataBeforeDelete = await responseBeforeDelete.json();
      const nextIndexBeforeDelete = dataBeforeDelete.ids.indexOf(exerciseID);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/exercises/${exerciseID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting exercise");
      }

      setExerciseIDs(exerciseIDs.filter((id) => id !== exerciseID));
      nextExercise(nextIndexBeforeDelete);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  }, [
    getAccessTokenSilently,
    exerciseID,
    setExerciseIDs,
    exerciseIDs,
    nextExercise,
  ]);

  // Toggle answer
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // Render the exercise container
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
            <button className="btn btn-primary" onClick={() => nextExercise()}>
              Next Exercise
            </button>
          </div>
        </div>
        {/* Admin-only buttons */}
        <div className="row mt-3">
          <div className="col">
            {canAddExercise && (
              <button
                className="btn btn-success me-2"
                onClick={() => setAddOpen(true)}
              >
                Add
              </button>
            )}
            {canAddExercise && addOpen ? (
              <AddExercise
                text="Add Exercise"
                closePopup={() => setAddOpen(false)}
                addExercise={addExercise}
              />
            ) : null}
            {canEditExercise && (
              <button
                className="btn btn-warning me-2"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </button>
            )}
            {canEditExercise && editOpen ? (
              <EditExercise
                text="Edit Exercise"
                closePopup={() => setEditOpen(false)}
                editExercise={editExercise}
                exerciseID={exerciseID}
              />
            ) : null}
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

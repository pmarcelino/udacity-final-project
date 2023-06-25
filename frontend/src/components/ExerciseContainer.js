import React, { useState, useEffect, useContext, useCallback } from "react";
import ExerciseContext from "./ExerciseContext";
import { AddExercise } from "./AddExercise";
import { EditExercise } from "./EditExercise";

const ExerciseContainer = () => {
  const [exerciseID, setExerciseID] = useState("");
  const [exerciseQuestion, setExerciseQuestion] = useState("");
  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const {
    selectedExerciseID,
    setSelectedExerciseID,
    exerciseIDs,
    setExerciseIDs,
    reviewerID,
    token,
    permissions,
  } = useContext(ExerciseContext);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const canAddExercise = permissions.includes("post:exercise");
  const canEditExercise = permissions.includes("patch:exercise");
  const canDeleteExercise = permissions.includes("delete:exercise");

  // Choose a random exercise ID from the exercise IDs available in the context
  useEffect(() => {
    if (exerciseIDs.length > 0) {
      const randomIndex = Math.floor(Math.random() * exerciseIDs.length);
      const randomID = exerciseIDs[randomIndex];
      setSelectedExerciseID(randomID);
    }
  }, [exerciseIDs, setSelectedExerciseID]);

  // Get specific exercise from the backend
  const fetchSpecificExercise = useCallback(
    async (selectedExerciseID) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/exercises/${selectedExerciseID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const exerciseData = await response.json();

        setExerciseID(exerciseData.id);
        setExerciseQuestion(exerciseData.question);
        setExerciseAnswer(exerciseData.answer);
      } catch (error) {
        console.error("Error fetching specific exercise:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (selectedExerciseID) {
      fetchSpecificExercise(selectedExerciseID);
    }
  }, [selectedExerciseID, fetchSpecificExercise]);

  // Go to the next exercise
  const nextExercise = useCallback(async () => {
    if (exerciseIDs.length === 0) {
      // No exercise IDs available
      return;
    }

    const currentIndex = exerciseIDs.indexOf(exerciseID);
    const nextIndex = (currentIndex + 1) % exerciseIDs.length;
    const nextID = exerciseIDs[nextIndex];

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/exercises/${nextID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const exerciseData = await response.json();

      setExerciseID(exerciseData.id);
      setExerciseQuestion(exerciseData.question);
      setExerciseAnswer(exerciseData.answer);
      setSelectedExerciseID(exerciseData.id);
    } catch (error) {
      console.error("Error fetching next exercise:", error);
    }
  }, [
    exerciseIDs,
    exerciseID,
    setExerciseID,
    setExerciseQuestion,
    setExerciseAnswer,
    setSelectedExerciseID,
    token,
  ]);

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
      // Save the nextIndex before deleting the current exercise
      const responseBeforeDelete = await fetch(
        `${process.env.REACT_APP_API_URL}/exercises`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
  }, [token, exerciseID, setExerciseIDs, exerciseIDs, nextExercise]);

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
                reviewerID={reviewerID}
                token={token}
                exerciseAnswer={exerciseAnswer}
                exerciseQuestion={exerciseQuestion}
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

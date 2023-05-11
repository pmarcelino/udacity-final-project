import React, { useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// EditExercise component definition
export const EditExercise = ({ closePopup, editExercise, exerciseID }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const token = await getAccessTokenSilently();

        const payload = {
          question: question,
          answer: answer,
        };

        const response = await fetch(
          `http://localhost:5000/exercises/${exerciseID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Error adding exercise");
        }

        const data = await response.json();

        setQuestion("");
        setAnswer("");
        editExercise(data);
        setShowSuccessMessage(true);
      } catch (error) {
        console.error("Error editing exercise:", error);
      }
    },
    [getAccessTokenSilently, question, answer, exerciseID, editExercise]
  );

  // const handleClose = useCallback(() => {
  //   setShowSuccessMessage(false);
  //   closePopup();
  // }, [closePopup]);

  const handleClose = useCallback(
    (e) => {
      e.preventDefault();
      setShowSuccessMessage(false);
      closePopup();
    },
    [closePopup]
  );

  // Render the component
  return (
    <div className="popup-container">
      <div className="popup-body">
        <h1>Edit Exercise</h1>
        {/* Conditional rendering based on success message state */}
        {showSuccessMessage ? (
          <div>
            <p>Exercise edited successfully!</p>
            <button className="btn btn-primary" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          // Render form for inputting question and answer
          <form className="popup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="question">Question</label>
              <textarea
                className="form-control"
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows="3"
              ></textarea>
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1">Answer</label>
              <textarea
                className="form-control"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows="3"
              ></textarea>
            </div>
            <br />
            {/* Submit and close buttons */}
            <button className="btn btn-success" type="submit">
              Submit
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Popup component definition
export const Popup = ({ closePopup, addExerciseID }) => {
  // Local state management using useState hook
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Access the Auth0 hook to get the getAccessTokenSilently function
  const { getAccessTokenSilently } = useAuth0();

  // Form submit handler
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Obtain the access token from Auth0
    const token = await getAccessTokenSilently();

    // Prepare the payload with question and answer
    const payload = {
      question: question,
      answer: answer,
    };

    try {
      // Send a POST request to the API with the payload and access token
      const response = await fetch("http://localhost:5000/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Check for successful response
      if (!response.ok) {
        throw new Error("Error adding exercise");
      }

      // Process the response
      const data = await response.json();

      // Reset form fields and display success message
      setQuestion("");
      setAnswer("");

      // Call the addExerciseID function to update the exerciseIDs state in the parent component
      addExerciseID(data.id);

      // Show success message and close button
      setShowSuccessMessage(true);
    } catch (error) {
      // Log any errors
      console.error("Error adding exercise:", error);
    }
  };

  // Render the component
  return (
    <div className="popup-container">
      <div className="popup-body">
        <h1>Add Exercise</h1>
        {/* Conditional rendering based on success message state */}
        {showSuccessMessage ? (
          <div>
            <p>Exercise added successfully!</p>
            <button className="btn btn-primary" onClick={closePopup}>
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
            <button className="btn btn-danger" onClick={closePopup}>
              Close
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from "react";

export const Popup = ({ closePopup }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question: question,
      answer: answer,
    };

    // Replace the URL below with your Flask app's URL
    const response = await fetch("http://localhost:5000/api/endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);

    // Reset form fields
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="popup-container">
      <div className="popup-body">
        <h1>Form</h1>
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
          <button className="btn btn-success" type="submit">
            Submit
          </button>
        </form>
        <button className="btn btn-danger" onClick={closePopup}>
          Close
        </button>
      </div>
    </div>
  );
};

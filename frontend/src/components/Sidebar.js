import React, { useState, useEffect, useContext } from "react";
import ExerciseContext from "./ExerciseContext";

const Sidebar = () => {
  // Get exercises IDs from the backend
  const [exerciseIDs, setExerciseIDs] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/exercises")
      .then((response) => response.json())
      .then((data) => {
        setExerciseIDs(data.ids);
      });
  }, []);

  // Get function setSelectedExerciseID from ExerciseContext
  const { setSelectedExerciseID } = useContext(ExerciseContext);

  return (
    <nav className="nav flex-column">
      {exerciseIDs.map((id) => (
        <button
          key={id}
          className="btn btn-link text-start text-decoration-none"
          onClick={() => setSelectedExerciseID(id)}
        >
          Exercise {id}
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;

import React, { useEffect, useContext } from "react";
import ExerciseContext from "./ExerciseContext";

const Sidebar = () => {
  const { exerciseIDs, setExerciseIDs, setSelectedExerciseID } =
    useContext(ExerciseContext);

  useEffect(() => {
    fetch("http://localhost:5000/exercises")
      .then((response) => response.json())
      .then((data) => {
        setExerciseIDs(data.ids);
      });
  }, [setExerciseIDs]);

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

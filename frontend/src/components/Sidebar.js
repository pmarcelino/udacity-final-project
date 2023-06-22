import React, { useEffect, useContext } from "react";
import ExerciseContext from "./ExerciseContext";

const Sidebar = () => {
  const { exerciseIDs, setExerciseIDs, setSelectedExerciseID, token } =
    useContext(ExerciseContext);

  useEffect(() => {
    const fetchExerciseIDs = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/exercises`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setExerciseIDs(data.ids);
      } catch (error) {
        console.error("Error fetching exercise IDs:", error);
      }
    };

    fetchExerciseIDs();
  }, [setExerciseIDs, token]);

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

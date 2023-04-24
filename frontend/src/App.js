import "./App.css";
import "./styles.css";
import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExerciseContainer from "./components/ExerciseContainer";
import ExerciseContext from "./components/ExerciseContext";

function App() {
  const [selectedExerciseID, setSelectedExerciseID] = useState(null);

  return (
    <ExerciseContext.Provider
      value={{ selectedExerciseID, setSelectedExerciseID }}
    >
      <div className="App">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <Sidebar />
            </div>
            <div className="col-md-9">
              <ExerciseContainer />
            </div>
          </div>
        </div>
      </div>
    </ExerciseContext.Provider>
  );
}

export default App;

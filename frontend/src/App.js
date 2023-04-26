import "./App.css";
import "./styles.css";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExerciseContainer from "./components/ExerciseContainer";
import ExerciseContext from "./components/ExerciseContext";
import Loading from "./components/Loading";

function App() {
  const [selectedExerciseID, setSelectedExerciseID] = useState(null);
  const [exerciseIDs, setExerciseIDs] = useState([]);
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ExerciseContext.Provider
      value={{
        selectedExerciseID,
        setSelectedExerciseID,
        exerciseIDs,
        setExerciseIDs,
      }}
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

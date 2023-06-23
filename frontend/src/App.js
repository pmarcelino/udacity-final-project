import "./App.css";
import "./styles.css";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExerciseContainer from "./components/ExerciseContainer";
import ExerciseContext from "./components/ExerciseContext";
import Loading from "./components/Loading";
import jwtDecode from "jwt-decode";

function App() {
  const [selectedExerciseID, setSelectedExerciseID] = useState(null);
  const [exerciseIDs, setExerciseIDs] = useState([]);
  const [reviewerID, setReviewerID] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [token, setToken] = useState(null);
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();

  // Update token and permissions when user logs in
  const fetchAccessToken = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const decodedToken = jwtDecode(token);
      const reviewerID = decodedToken.sub;
      const tokenPermissions = decodedToken["permissions"] || [];
      setToken(token);
      setPermissions(tokenPermissions);
      setReviewerID(reviewerID);
    } catch (error) {
      console.error("Error fetching Access Token:", error);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAccessToken();
    }
  }, [isAuthenticated, fetchAccessToken]);

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return (
      <ExerciseContext.Provider
        value={{
          selectedExerciseID,
          setSelectedExerciseID,
          exerciseIDs,
          setExerciseIDs,
          token,
          permissions,
          reviewerID,
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
  } else {
    loginWithRedirect();
    return null;
  }
}

export default App;

import { createContext } from "react";

const ExerciseContext = createContext({
  selectedExerciseID: null,
  setSelectedExerciseID: () => {},
  exerciseIDs: [],
  setExerciseIDs: () => {},
  permissions: [],
  setPermissions: () => {},
  token: null,
  setToken: () => {},
});

export default ExerciseContext;

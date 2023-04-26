import { createContext } from "react";

const ExerciseContext = createContext({
  selectedExerciseID: null,
  setSelectedExerciseID: () => {},
  exerciseIDs: [],
  setExerciseIDs: () => {},
});

export default ExerciseContext;

// Exercises.js
import React, { useState } from "react";
import MuscleGroups from "../components/MuscleGroups";
import ExerciseProgramList from "./ExerciseProgramList"; // Import ExerciseProgramList component

const Exercises = () => {
  const [showMuscleGroups, setShowMuscleGroups] = useState(false);

  // Toggle between program list and exercise creation views
  const handleCreateExercise = () => {
    setShowMuscleGroups(true);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
        <div className="w-full">
          <ExerciseProgramList />
        </div>
    </div>
  );
};

export default Exercises;

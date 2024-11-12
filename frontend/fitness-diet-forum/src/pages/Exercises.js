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
      <h1 className="text-3xl font-bold mb-6">My Exercises</h1>
      
      {/* Button to trigger exercise creation */}
      <button
        onClick={handleCreateExercise}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-6"
      >
        Create a New Exercise
      </button>

      {/* Conditionally render exercise creation or exercise program list */}
      {showMuscleGroups ? (
        <div className="w-full max-w-xl">
          <MuscleGroups />
        </div>
      ) : (
        <div className="w-full">
          <ExerciseProgramList />
        </div>
      )}
    </div>
  );
};

export default Exercises;

// Exercises.js
import React, { useState } from "react";
import MuscleGroups from "../components/MuscleGroups";
import ExerciseProgramList from "./ExerciseProgramList"; // Import ExerciseProgramList component
import WeekProgram from "../components/WeekProgram";

const Exercises = () => {
  const [showMuscleGroups, setShowMuscleGroups] = useState(false);

  

  // Toggle between program list and exercise creation views
  const handleCreateExercise = () => {
    setShowMuscleGroups(true);
  };

  const [programs] = useState([
    {
      id: 1,
      day: "Monday",
      programName: "Leg Day",
      exercises: [
        {
          exerciseName: "Chair Squats",
          sets: 3,
          reps: "6-8",
          imageUrl: "/chair_squats.jpeg",
        },
        {
          exerciseName: "Lunges",
          sets: 4,
          reps: "10-12",
          imageUrl: "/lunges.jpeg",
        },
      ],
    },
    {
      id: 2,
      day: "Tuesday",
      programName: "Upper Body Strength",
      exercises: [
        {
          exerciseName: "Push-Ups",
          sets: 3,
          reps: "10-15",
          imageUrl: "/push_ups.jpeg",
        },
        {
          exerciseName: "Pull-Ups",
          sets: 4,
          reps: "5-8",
          imageUrl: "/pull_ups.jpeg",
        },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
        <div className="w-full">
          <ExerciseProgramList />
        </div>
      <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
      
      <div className="p-8 bg-gray-800 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Weekly Exercise Program</h1>
      <WeekProgram programs={programs} />
    </div>
    </div>

    </div>
  );
};

export default Exercises;

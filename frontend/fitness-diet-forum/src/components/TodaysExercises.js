import React, { useState } from "react";

const TodaysExercises = ({ day, programs, onEndExercise }) => {
  const [completedExercises, setCompletedExercises] = useState([]);

  const handleToggleExercise = (exerciseName) => {
    setCompletedExercises((prevCompleted) =>
      prevCompleted.includes(exerciseName)
        ? prevCompleted.filter((name) => name !== exerciseName)
        : [...prevCompleted, exerciseName]
    );
  };

  if (!day) {
    return null; // Eğer bir gün seçili değilse hiçbir şey gösterme
  }

  return (
    <div className="mt-6 bg-gray-900 p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Today's Exercises: {day}</h2>
      {programs.length > 0 ? (
        programs.map((program) => (
          <div key={program.id} className="mb-4">
            <h3 className="font-bold">{program.programName}</h3>
            <ul className="ml-4">
              {program.exercises.map((exercise, index) => (
                <li key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-green-600"
                    checked={completedExercises.includes(exercise.exerciseName)}
                    onChange={() => handleToggleExercise(exercise.exerciseName)}
                  />
                  <span>
                    {exercise.exerciseName} ({exercise.sets} sets of {exercise.reps})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No exercises for today</p>
      )}
      <button
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        onClick={onEndExercise}
      >
        End Exercise
      </button>
    </div>
  );
};

export default TodaysExercises;
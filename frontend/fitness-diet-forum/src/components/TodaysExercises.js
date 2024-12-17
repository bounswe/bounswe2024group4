import React, { useState } from "react";

const TodaysExercises = ({ day, programs, onEndExercise }) => {
  const [completedExercises, setCompletedExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState({});

  const handleToggleExercise = (exerciseName) => {
    setCompletedExercises((prevCompleted) =>
      prevCompleted.includes(exerciseName)
        ? prevCompleted.filter((name) => name !== exerciseName)
        : [...prevCompleted, exerciseName]
    );
  };

  const handleInputChange = (exerciseName, field, value) => {
    setExerciseDetails((prevDetails) => ({
      ...prevDetails,
      [exerciseName]: {
        ...prevDetails[exerciseName],
        [field]: value,
      },
    }));
  };

  if (!day) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-900 p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Today's Exercises: {day}</h2>
      {programs.length > 0 ? (
        programs.map((program) => (
          <div key={program.id} className="mb-4">
            <h3 className="font-bold text-lg">{program.workout_name}</h3>
            <ul className="ml-4 list-disc">
              {program.exercises.map((exercise, index) => (
                <li key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-green-600"
                    checked={completedExercises.includes(exercise.name)}
                    onChange={() => handleToggleExercise(exercise.name)}
                  />
                  <span>
                    {exercise.name} ({exercise.sets} set of {exercise.reps} reps)
                  </span>
                  <div className="ml-4">
                    {/* Display the actual sets and reps */}
                    <div>
                      <span className="font-semibold">Actual:</span> {exercise.sets} sets, {exercise.reps} reps
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold">Done:</span>
                      <div>
                        <input
                          type="number"
                          placeholder="Sets"
                          className="form-input text-black"
                          value={exerciseDetails[exercise.name]?.sets || ""}
                          onChange={(e) =>
                            handleInputChange(exercise.name, "sets", e.target.value)
                          }
                        />
                        <input
                          type="number"
                          placeholder="Reps"
                          className="form-input ml-2 text-black"
                          value={exerciseDetails[exercise.name]?.reps || ""}
                          onChange={(e) =>
                            handleInputChange(exercise.name, "reps", e.target.value)
                          }
                        />
                        <input
                          type="number"
                          placeholder="Weight"
                          className="form-input ml-2 text-black"
                          value={exerciseDetails[exercise.name]?.weight || ""}
                          onChange={(e) =>
                            handleInputChange(exercise.name, "weight", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
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
        onClick={() => onEndExercise(completedExercises, exerciseDetails)}
      >
        End Exercise
      </button>
    </div>
  );
};

export default TodaysExercises;

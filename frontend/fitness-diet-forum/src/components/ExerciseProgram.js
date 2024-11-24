import React from 'react';
import Exercise from './Exercise';
import '../css/index.css';

const ExerciseProgram = ({ programName, exercises, onDelete, isOwn }) => {
    return (
        <div className="exercise-program bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-6 text-lightText flex flex-col">
            {/* Program Name */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">{programName}</h2>
            </div>

            {/* List of Exercises */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exercises.map((exercise, index) => (
                    <Exercise
                        key={index}
                        exerciseName={exercise.name}
                        sets={exercise.sets}
                        reps={exercise.reps}
                        instruction={exercise.instruction}
                        equipment={exercise.equipment}
                    />
                ))}
            </div>

            {isOwn && (
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                        onClick={onDelete}
                    >
                        Delete Program
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExerciseProgram;

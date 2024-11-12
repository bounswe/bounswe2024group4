// ExerciseProgramList.js
import React, { useState } from 'react';
import ExerciseProgram from '../components/ExerciseProgram';
import MuscleGroups from "../components/MuscleGroups";

const ExerciseProgramList = () => {
    const [programs, setPrograms] = useState([
        {
            id: 1,
            programName: 'Leg Day',
            exercises: [
                {
                    exerciseName: 'Chair Squats',
                    sets: 3,
                    reps: '6-8',
                    imageUrl: '/chair_squats.jpeg',
                },
                {
                    exerciseName: 'Lunges',
                    sets: 4,
                    reps: '10-12',
                    imageUrl: '/lunges.jpeg',
                },
            ],
        },
        {
            id: 2,
            programName: 'Upper Body Strength',
            exercises: [
                {
                    exerciseName: 'Push-Ups',
                    sets: 3,
                    reps: '10-15',
                    imageUrl: '/push_ups.jpeg',
                },
                {
                    exerciseName: 'Pull-Ups',
                    sets: 4,
                    reps: '5-8',
                    imageUrl: '/pull_ups.jpeg',
                },
            ],
        },
    ]);

    const [showExerciseCreation, setShowExerciseCreation] = useState(false);

    // Function to delete an exercise program
    const deleteProgram = (programId) => {
        setPrograms(programs.filter(program => program.id !== programId));
    };

    // Function to handle "Create a New Program" button click
    const handleCreateProgram = () => {
        setShowExerciseCreation(true);
    };

    return (
        <div className="exercise-program-list p-8 bg-darkBackground min-h-screen text-lightText">
            <h1 className="text-4xl font-bold mb-10 tracking-wider">Exercise Programs</h1>

            {/* Display existing exercise programs */}
            <div className="grid gap-10">
                {programs.map(program => (
                    <ExerciseProgram
                        key={program.id}
                        programName={program.programName}
                        exercises={program.exercises}
                        onDelete={() => deleteProgram(program.id)}
                    />
                ))}
            </div>

            {/* Button to create a new program */}
            <button
                className="mt-10 bg-primary text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
                onClick={handleCreateProgram}
            >
                Create a New Program
            </button>

            {/* Conditionally render the exercise creation section */}
            {showExerciseCreation && (
                <div className="mt-10 w-full max-w-xl">
                    <h2 className="text-3xl font-bold mb-6">My Exercises</h2>
                    <MuscleGroups />
                </div>
            )}
        </div>
    );
};

export default ExerciseProgramList;

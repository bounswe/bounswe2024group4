import React, { useState, useContext } from 'react';
import ExerciseProgram from '../components/ExerciseProgram';
import MuscleGroups from "../components/MuscleGroups";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";

const ExerciseProgramList = () => {
    const [programs, setPrograms] = useState([]);
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState(""); // State for workout name
    const [reps, setReps] = useState('');  // State for repetitions input
    const [sets, setSets] = useState('');  // State for sets input
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const csrf_token = localStorage.getItem("csrfToken");

    const fetchExercises = async (muscles) => {
        try {
            setIsLoading(true);
    
            // Create an array of promises for each muscle group
            const promises = muscles.map((muscle) =>
                axios.get(`${baseURL}/get_exercises/?muscle=${muscle}`)
            );
    
            // Use Promise.all to execute all requests concurrently and get all responses
            const responses = await Promise.all(promises);
    
            // Combine all exercise lists from the responses into one array
            const allExercises = responses.flatMap((response) => response.data);
            setExercises(allExercises);
        } catch (error) {
            console.error("Failed to fetch exercises:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExercise = (exercise) => {
        // Add exercise with reps, sets, and additional exercise details (type, name, muscle, etc.)
        if (reps && sets) {
            const newExercise = {
                workout: workoutName, // Use the workout name from the input
                type: exercise.type,
                name: exercise.name,
                muscle: exercise.muscle,
                equipment: exercise.equipment,
                instructions: exercise.instructions,
                repetitions: reps,
                sets: sets
            };
            setSelectedExercises([...selectedExercises, newExercise]);
    
            // Clear the input fields after adding the exercise
            setReps('');
            setSets('');
        } else {
            alert("Please provide both repetitions and sets.");
        }
    };
    
    const handleCreateProgram = async () => {
        if (!workoutName) {
            alert("Please provide a name for the workout program.");
            return;
        }
    
        try {
            const config = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrf_token,
                },
            };
    
            // Create an array of exercise data to send to the backend
            const workoutData = selectedExercises.map(exercise => ({
                type: exercise.type,
                name: exercise.name,
                muscle: exercise.muscle,
                equipment: exercise.equipment,
                instruction: exercise.instruction,
                repetitions: exercise.repetitions,
                sets: exercise.sets,
                instruction: exercise.instructions
            }));
    
            const body = {
                workout_name: workoutName, // Use the workout name from the input
                exercises: workoutData,
                username: localStorage.getItem("username")
            };
    
            const response = await axios.post(`${baseURL}/workout_program/`, body, config);
            setPrograms([...programs, response.data]);
            setSelectedExercises([]); // Clear selected exercises after saving
            setWorkoutName(""); // Clear the workout name input after saving
        } catch (error) {
            console.error("Failed to create workout program:", error);
        }
    };
    

    return (
        <div className="exercise-program-list p-8 bg-darkBackground min-h-screen text-lightText">
            <h1 className="text-4xl font-bold mb-10 tracking-wider">Exercise Programs</h1>
            <div className="grid gap-10">
                {programs.map(program => (
                    <ExerciseProgram
                        key={program.id}
                        programName={program.programName}
                        exercises={program.exercises}
                        onDelete={() => setPrograms(programs.filter(p => p.id !== program.id))}
                    />
                ))}
            </div>

            {!selectedMuscle ? (
                <MuscleGroups onSelectMuscle={(label, muscles) => {
                    setSelectedMuscle(label);
                    fetchExercises(muscles); // Fetch exercises based on selected muscle group
                }} />
            ) : (
                <div>
                    <h2 className="text-3xl font-bold">Exercises for {selectedMuscle}</h2>
                    {isLoading ? (
                        <p>Loading exercises...</p>
                    ) : (
                        <div>
                            <h3 className="text-2xl">Choose Exercises</h3>
                            <ul>
                                {exercises.map((exercise, index) => (
                                    <li key={index} className="exercise-item">
                                        <p>{exercise.name}</p>
                                        <input
                                            type="number"
                                            value={reps}
                                            onChange={(e) => setReps(e.target.value)}
                                            placeholder="Repetitions"
                                        />
                                        <input
                                            type="number"
                                            value={sets}
                                            onChange={(e) => setSets(e.target.value)}
                                            placeholder="Sets"
                                        />
                                        <button
                                            onClick={() => handleAddExercise(exercise)}
                                        >
                                            Add
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Display selected exercises preview */}
                            {selectedExercises.length > 0 && (
                                <div className="selected-exercises-preview mt-5">
                                    <h3 className="text-2xl">Preview of Added Exercises</h3>
                                    <ul>
                                        {selectedExercises.map((exercise, index) => (
                                            <li key={index} className="exercise-preview-item">
                                                <p>{exercise.name} - Reps: {exercise.repetitions}, Sets: {exercise.sets}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Workout name input */}
                            <div className="mt-5">
                                <label className="text-xl">Workout Program Name:</label>
                                <input
                                    type="text"
                                    className="mt-2 p-2 bg-darkText text-lightText"
                                    value={workoutName}
                                    onChange={(e) => setWorkoutName(e.target.value)}
                                    placeholder="Enter workout name"
                                />
                            </div>

                            <div className="mt-5">
                                <button onClick={() => setSelectedMuscle(null)}>Continue</button>
                                <button onClick={handleCreateProgram}>Complete Program</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExerciseProgramList;

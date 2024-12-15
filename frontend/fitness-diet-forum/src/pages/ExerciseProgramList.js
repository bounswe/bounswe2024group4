import React, { useState, useContext, useEffect } from 'react';
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
    const [isCreatingProgram, setIsCreatingProgram] = useState(false);
    const [isCreatingExercise, setIsCreatingExercise] = useState(false);
    const [exerciseData, setExerciseData] = useState({
        type: "",
        name: "",
        equipment: "",
        difficulty: "",
        instruction: "",
    });
    const [activeExerciseIndex, setActiveExerciseIndex] = useState(null); // Track active exercise for input fields
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        'Authorization': 'Token ' + token
      }
    }

    // Fetch user programs on component mount
    useEffect(() => {
        const fetchUserPrograms = async () => {
            try {
                const response = await axios.get(`${baseURL}/get-workouts/?username=${username}`, config);
                console.log('get workout response', response);
                setPrograms(response.data);
            } catch (error) {
                console.error("Error fetching user programs:", error);
            }
        };

        fetchUserPrograms();
    }, [baseURL, isCreatingProgram]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExerciseData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            ...exerciseData,
            muscle: selectedMuscle.toLowerCase(),
        };

        try {
            const response = await axios.post(baseURL + "/create-exercise/", payload, config);
            if (response.status === 201) {
                alert("Exercise created successfully");
                setIsCreatingExercise(false);
            } else {
                alert("Failed to create exercise");
                setIsCreatingExercise(false);
            }
        } catch (error) {
            console.error("Error creating exercise:", error);
            alert("An error occurred while creating the exercise.");
            setIsCreatingExercise(false);
        }
    };

    const fetchExercises = async (muscles) => {
        try {
            setIsLoading(true);
            // Create an array of promises for each muscle group
            const promises = muscles.map((muscle) =>
                axios.get(`${baseURL}/get_exercises/?muscle=${muscle}`, config)
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

    const handleDeleteProgram = async (programId) => {
        const programToDelete = programs.find(program => program.id === programId);
        const updatedPrograms = programs.filter(program => program.id !== programId);
    
        setPrograms(updatedPrograms);
    
        try {
            const response = await axios.delete(`${baseURL}/workouts/delete/${programId}/`, config);
            
            if (response.status !== 200) {
                setPrograms(prevPrograms => [...prevPrograms, programToDelete]);
                throw new Error('Failed to delete the program.');
            }
        } catch (error) {
            console.error('Error deleting program:', error);
            setPrograms(prevPrograms => [...prevPrograms, programToDelete]);
        }
    };

    const handleAddExercise = (exercise) => {
        if (reps && sets) {
            const newExercise = {
                workout: workoutName, 
                type: exercise.type,
                name: exercise.name,
                muscle: exercise.muscle,
                equipment: exercise.equipment,
                difficulty: exercise.difficulty,
                instruction: exercise.instruction,
                repetitions: reps,
                sets: sets
            };
            setSelectedExercises([...selectedExercises, newExercise]);
            // Clear the input fields after adding the exercise
            setReps('');
            setSets('');
            setActiveExerciseIndex(null); // Hide input fields after adding the exercise
        } else {
            alert("Please provide both repetitions and sets.");
        }
    };

    const handleCreateProgram = async () => {
        if (!workoutName) {
            alert("Please provide a name for the workout program.");
            return;
        }
        if(selectedExercises.length <= 0) {
            alert("Please provide at least one exercise for the workout program.");
            return;
        }

        try {
            const workoutData = selectedExercises.map(exercise => ({
                type: exercise.type,
                name: exercise.name,
                muscle: exercise.muscle,
                equipment: exercise.equipment,
                instruction: exercise.instruction || exercise.instructions,
                reps: exercise.repetitions,
                sets: exercise.sets,
                difficulty: exercise.difficulty
            }));

            const body = {
                workout_name: workoutName,
                exercises: workoutData
            };

            const response = await axios.post(`${baseURL}/workout_program/`, body, config);
            setSelectedExercises([]); // Clear selected exercises after saving
            setWorkoutName(""); // Clear the workout name input after saving
            setIsCreatingProgram(false); // Hide the program creation form after submitting
        } catch (error) {
            console.error("Failed to create workout program:", error);
        }
    };

    const handleCancel = () => {
        // Reset all states and hide the program creation form
        setSelectedMuscle(null);
        setExercises([]);
        setSelectedExercises([]);
        setWorkoutName('');
        setReps('');
        setSets('');
        setIsCreatingProgram(false);
    };

    const handleRemoveExercise = (exerciseIndex) => {
        // Remove exercise from the selectedExercises array by its index
        const updatedExercises = selectedExercises.filter((_, index) => index !== exerciseIndex);
        setSelectedExercises(updatedExercises);
    };

    return (
        <div className="exercise-program-list p-8 bg-darkBackground min-h-screen text-lightText flex">
            {/* Conditional rendering: Show either programs or the program creation form */}
            {isCreatingProgram ? (
                // Program Creation Form
                <div className="w-full flex">
                    <div className="muscle-groups-container w-1/3"> {/* Smaller muscle groups section */}
                        <MuscleGroups onSelectMuscle={(label, muscles) => {
                            setSelectedMuscle(label);
                            fetchExercises(muscles);
                        }} />
                    </div>

                    <div className="exercise-creation-form w-1/3 ml-10"> {/* Exercise creation section */}
                        {/* Workout name input moved to the top */}
                        
                        {selectedMuscle && (
                            <div className="exercises-container">
                                <h2 className="text-3xl font-bold pb-4">Exercises for {selectedMuscle}</h2>
                                {isLoading ? (
                                    <p>Loading exercises...</p>
                                ) : (
                                    <div>
                                        <ul>
                                            {exercises.map((exercise, index) => (
                                                <li
                                                    key={index}
                                                    className={`exercise-item mb-4 p-3 rounded-sm ${activeExerciseIndex === index ? "bg-gray-800" : ""}`}
                                                >
                                                    <div>
                                                        <p 
                                                            onClick={() => setActiveExerciseIndex(index)} 
                                                            className="cursor-pointer text-xl hover:text-primary font-bold"
                                                        >
                                                            {exercise.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{exercise.difficulty}</p>
                                                    </div>
                                                    {/* Show inputs for active exercise */}
                                                    {activeExerciseIndex === index && (
                                                        <div className="exercise-inputs mt-3">
                                                            <div className="flex items-center space-x-3"> {/* Reduced space between elements */}
                                                                <div className="flex items-center space-x-1"> {/* Less space between "Reps" and input */}
                                                                    <span>Reps:</span>
                                                                    <input
                                                                        type="number"
                                                                        value={reps}
                                                                        onChange={(e) => setReps(e.target.value)}
                                                                        placeholder="Repetitions"
                                                                        className="w-20 p-2 bg-gray-200 text-gray-800 text-sm rounded-sm border border-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                                                                    />
                                                                </div>
                                                                
                                                                <div className="flex items-center space-x-1"> {/* Less space between "Sets" and input */}
                                                                    <span>Sets:</span>
                                                                    <input
                                                                        type="number"
                                                                        value={sets}
                                                                        onChange={(e) => setSets(e.target.value)}
                                                                        placeholder="Sets"
                                                                        className="w-20 p-2 bg-gray-200 text-gray-800 text-sm rounded-sm border border-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                                                                        />
                                                                </div>
                                                                
                                                                <button
                                                                    onClick={() => handleAddExercise(exercise)}
                                                                    className="p-1.5 bg-primary text-white rounded-full"
                                                                >
                                                                    Add
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Preview Section (Third Column) */}
                    <div className="exercise-preview w-1/3 ml-10"> {/* Preview section */}
                        <h1 className="text-4xl font-bold mb-10 tracking-wider">Preview of Your Workout</h1>
                        <div className="mt-5 pb-6">
                            <label className="text-xl">Workout Program Name:</label>
                            <input
                                type="text"
                                className="mt-2 p-2 bg-darkText text-gray-800 rounded-lg"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                                placeholder="Enter workout name"
                            />
                        </div>
                        {selectedExercises.length > 0 ? (
                            <ul>
                                {selectedExercises.map((exercise, index) => (
                                    <li key={index} className="mb-4">
                                        <p className="text-xl">{exercise.name} ({exercise.muscle})</p>
                                        <p>Sets: {exercise.sets} | Reps: {exercise.repetitions}</p>
                                        <p>Difficulty: {exercise.difficulty}</p>
                                        <button
                                            className="text-red-500"
                                            onClick={() => handleRemoveExercise(index)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No exercises added yet.</p>
                        )}

                        {/* Cancel and Complete Buttons under Preview */}
                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={handleCancel}
                                className="p-3 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProgram}
                                className="p-3 bg-primary text-white rounded-lg"
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
            ) : isCreatingExercise ? (
                <div className="w-full flex justify-between gap-16">
        {/* Muscle Groups Section */}
        <div className="muscle-groups-container w-1/3">
            <MuscleGroups
                onSelectMuscle={(label, matches) => {
                    setSelectedMuscle(matches[0]);
                }}
            />
        </div>

        {/* Input Form Section */}
        <div className="input-container w-1/2 flex flex-col gap-2">
        <h2 className="text-xl font-semibold mb-4">Exercise Details</h2>
            <input
                type="text"
                name="name"
                placeholder="Selected Muscle Group"
                value={selectedMuscle ? selectedMuscle.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ""}
                disabled={true}
                className="p-2 border rounded bg-gray-600"
            />
            <input
                type="text"
                name="name"
                placeholder="Exercise Name"
                value={exerciseData.name}
                onChange={handleInputChange}
                className="p-2 border rounded bg-gray-600"
            />
            <select
                name="type"
                value={exerciseData.type}
                onChange={handleInputChange}
                className="p-2 border rounded bg-gray-600"
            >
                <option value="">Select Exercise Type</option>
                <option value="cardio">Cardio</option>
                <option value="olympic_weightlifting">Olympic Weightlifting</option>
                <option value="plyometrics">Plyometrics</option>
                <option value="powerlifting">Powerlifting</option>
                <option value="strength">Strength</option>
                <option value="stretching">Stretching</option>
                <option value="strongman">Strongman</option>
            </select>
            <input
                type="text"
                name="equipment"
                placeholder="Equipment"
                value={exerciseData.equipment}
                onChange={handleInputChange}
                className="p-2 border rounded bg-gray-600"
            />
            <select
                name="difficulty"
                value={exerciseData.difficulty}
                onChange={handleInputChange}
                className="p-2 border rounded bg-gray-600"
            >
                <option value="">Select Difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
            </select>
            <textarea
                name="instruction"
                placeholder="Exercise Instructions"
                value={exerciseData.instruction}
                onChange={handleInputChange}
                className="p-2 border rounded bg-gray-600"
            />
            <button
                onClick={handleSubmit}
                className="p-2 bg-primary text-white rounded-lg"
            >
                Submit Exercise
            </button>
        </div>
    </div>
            ) : (
                // Display User Programs
                <div className="user-programs-list w-full">
                    <div className="flex flex-wrap items-start justify-between gap-8">
                        <h1 className="text-4xl font-bold mb-10 tracking-wider">
                            Your Exercise Programs
                        </h1>
                        <div>
                            <button
                                onClick={() => setIsCreatingProgram(true)}
                                className="p-2 bg-primary text-white rounded-lg mr-2"
                            >
                                Create New Program
                            </button>
                            <button
                                onClick={()=>setIsCreatingExercise(true)}
                                className="p-2 bg-primary text-white rounded-lg"
                            >
                                Create New Exercise
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-8">
                        {programs.length === 0 ? (
                            <p>No programs created yet.</p>
                        ) : (
                            programs.map((program) => (
                                <ExerciseProgram
                                    key={program.id}  // Use `program.id` as the unique key
                                    programName={program.workout_name}
                                    exercises={program.exercises}
                                    onDelete={() => handleDeleteProgram(program.id)}
                                    isOwn={true}
                                    programId={program.id}
                                    currentRating={program.rating}
                                    ratingCount={program.rating_count}
                                    showRating={false}
                                />
                            ))
                        )}
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default ExerciseProgramList;

import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import ExerciseProgram from "./ExerciseProgram.js";

const CreatePostModal = ({
  isModalOpen,
  closeModal
}) => {
  const [newWorkout, setNewWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [visibleWorkout, setVisibleWorkout] = useState(null); // Track currently visible workout

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem('username')

  useEffect(() => {
    // Fetch workouts data when modal opens
    if (isModalOpen) {
      axios
        .get(`${baseURL}/get-workouts/?username=${username}`) // Adjust this URL to use actual username
        .then((response) => {
          setWorkouts(response.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [isModalOpen, baseURL]);

  const handleAddWorkout = () => {
    const selectedWorkout = workouts.find(workout => workout.id === parseInt(newWorkout));
    if (selectedWorkout && !selectedWorkouts.some(workout => workout.id === selectedWorkout.id)) {
      setSelectedWorkouts([...selectedWorkouts, selectedWorkout]);
    }
  };

  const handleRemoveSelected = (workoutId) => {
    setSelectedWorkouts(selectedWorkouts.filter(workout => workout.id !== workoutId));
    if (visibleWorkout === workoutId) {
      setVisibleWorkout(null); // Hide if it's currently visible
    }
  };

  const toggleExerciseProgram = (workoutId) => {
    // If the clicked workout is already visible, hide it. Otherwise, show it.
    setVisibleWorkout(visibleWorkout === workoutId ? null : workoutId);
  };

  const handleSubmitPost = () => {
    console.log("Post submitted:", { postContent, selectedWorkouts });
    closeModal(); // Close the modal after submission
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-10 rounded shadow-lg w-[700px] h-[80%] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Create a Post</h2>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your post here..."
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows={4}
          ></textarea>

          {/* Workout Selection */}
          <div className="mb-4">
            <select
              value={newWorkout}
              onChange={(e) => setNewWorkout(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>Select a workout program</option>
              {workouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.workout_name}
                </option>
              ))}
            </select>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddWorkout}
            >
              Add Workout
            </button>
          </div>

          {/* Display Added Workouts */}
          {selectedWorkouts.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-black">Added Workouts</h3>
              <div className="flex gap-2 flex-wrap">
                {selectedWorkouts.map((workout) => (
                  <button
                    key={workout.id}
                    className="bg-gray-300 text-black p-2 rounded m-2 hover:bg-gray-400"
                    onClick={() => toggleExerciseProgram(workout.id)}
                  >
                    {workout.workout_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Display the Exercise Program if selected */}
          {visibleWorkout && (
            <div className="mt-4 mb-6">
              {selectedWorkouts
                .filter(workout => workout.id === visibleWorkout)
                .map((workout) => (
                  <ExerciseProgram
                    key={workout.id} // Unique program ID as key
                    programName={workout.workout_name}
                    exercises={workout.exercises} // Assuming workouts have exercises as part of the data
                    onDelete={() => handleRemoveSelected(workout.id)} // Handle workout removal
                    isOwn={true} // Assuming this is part of the workout data
                    currentRating={workout.rating}
                    ratingCount={workout.rating_count}
                  />
                ))}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitPost}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreatePostModal;

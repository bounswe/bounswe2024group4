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
  const [visibleWorkout, setVisibleWorkout] = useState(null);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem('username')

  useEffect(() => {
    if (isModalOpen) {
      axios
        .get(`${baseURL}/get-workouts/?username=${username}`)
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
      setVisibleWorkout(null);
    }
  };

  const toggleExerciseProgram = (workoutId) => {
    setVisibleWorkout(visibleWorkout === workoutId ? null : workoutId);
  };

  const handleSubmitPost = () => {
    console.log("Post submitted:", { postContent, selectedWorkouts });
    closeModal();
    setNewWorkout("");
    setWorkouts([]);
    setSelectedWorkouts([]);
    setPostContent("");
    setVisibleWorkout(null);
  };

  const handleCancel = () => {
    closeModal();
    setNewWorkout("");
    setWorkouts([]);
    setSelectedWorkouts([]);
    setPostContent("");
    setVisibleWorkout(null);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-8 w-[700px] h-[80%] overflow-y-auto">
          <h2 className="text-xl font-bold text-lightText mb-4">Create a Post</h2>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your post here..."
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-700 text-white placeholder-gray-400"
            rows={4}
          ></textarea>

          {/* Workout Selection */}
          <div className="mb-4">
            <select
              value={newWorkout}
              onChange={(e) => setNewWorkout(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" // Adjust background color
            >
              <option value="" disabled>
                Select a workout program
              </option>
              <option value="">{newWorkout ? workouts.find(workout => workout.id === parseInt(newWorkout))?.workout_name : 'Workouts'}</option>
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
              <h3 className="font-semibold text-lightText">Added Workouts</h3>
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
                    key={workout.id}
                    programName={workout.workout_name}
                    exercises={workout.exercises}
                    onDelete={() => handleRemoveSelected(workout.id)}
                    isOwn={true}
                    currentRating={workout.rating}
                    ratingCount={workout.rating_count}
                  />
                ))}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={handleCancel}
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

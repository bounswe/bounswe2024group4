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
  const [postContent, setPostContent] = useState("");
  const [visibleWorkout, setVisibleWorkout] = useState(null);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem('username');
  const csrf_token = localStorage.getItem("csrfToken");

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
    if (newWorkout) {
      setVisibleWorkout(parseInt(newWorkout)); // Show details for the selected workout
    }
  };

  const handleRemoveWorkout = () => {
    setNewWorkout("");
    setVisibleWorkout(null);
  };

  const handleCreatePost = async () => {
    if (!newWorkout && !postContent) {
      alert("Please provide content for the post and select a workout.");
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

      const body = {
        content: postContent,
        workoutId: parseInt(newWorkout),
        username: username
      };
      console.log(body);
      await axios.post(`${baseURL}/post/`, body, config);

      closeModal();
      setNewWorkout("");
      setWorkouts([]);
      setPostContent("");
      setVisibleWorkout(null);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleCancel = () => {
    closeModal();
    setNewWorkout("");
    setWorkouts([]);
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
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value="" disabled>
                Select a workout program
              </option>
              {workouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.workout_name}
                </option>
              ))}
            </select>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddWorkout}
              disabled={!newWorkout}
            >
              Add Workout
            </button>
          </div>

          {/* Display Selected Workout */}
          {visibleWorkout && (
            <div className="mt-4 mb-6">
              {workouts
                .filter((workout) => workout.id === visibleWorkout)
                .map((workout) => (
                  <ExerciseProgram
                    key={workout.id}
                    programName={workout.workout_name}
                    exercises={workout.exercises}
                    onDelete={handleRemoveWorkout}
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
              onClick={handleCreatePost}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!newWorkout && !postContent}
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

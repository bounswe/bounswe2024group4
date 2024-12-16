import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";
import ExerciseProgram from "./ExerciseProgram.js";
import Meal from "./Meal.js";

const CreatePostModal = ({
  isModalOpen,
  closeModal
}) => {
  const [postContent, setPostContent] = useState("");

  const [newWorkout, setNewWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [visibleWorkout, setVisibleWorkout] = useState(null);

  const [newMeal, setNewMeal] = useState(""); // State for meal selection
  const [meals, setMeals] = useState([]); // State for available meals
  const [visibleMeal, setVisibleMeal] = useState(null); // State for visible meal details

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem('username');
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      'Authorization': 'Token ' + token
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      axios
        .get(`${baseURL}/get-workouts/`, config)
        .then((response) => {
          setWorkouts(response.data);
        })
        .catch((error) => {
          console.log(error.message);
        });

      axios
        .get(`${baseURL}/get_meals/`, config)
        .then((response) => {
          setMeals(response.data.meals);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [isModalOpen, baseURL]);

  const handleAddWorkout = () => {
    if (newWorkout) {
      setVisibleWorkout(parseInt(newWorkout));
    }
  };

  const handleRemoveWorkout = () => {
    setNewWorkout("");
    setVisibleWorkout(null);
  };

  const handleAddMeal = () => {
    if (newMeal) {
      setVisibleMeal(parseInt(newMeal));
    }
  };

  const handleRemoveMeal = () => {
    setNewMeal("");
    setVisibleMeal(null);
  };

  const handleCreatePost = async () => {
    if (!postContent) {
      alert("Please provide content for the post.");
      return;
    }
    try {
      const body = {
        content: postContent,
        workoutId: newWorkout ? parseInt(newWorkout) : null,
        mealId: newMeal ? parseInt(newMeal) : null
      };
      console.log(body);
      await axios.post(`${baseURL}/post/`, body, config);

      closeModal();
      setNewWorkout("");
      setWorkouts([]);
      setPostContent("");
      setVisibleWorkout(null);
      setNewMeal("");
      setMeals([]);
      setVisibleMeal(null);
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
    setNewMeal("");
    setMeals([]);
    setVisibleMeal(null);
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
                    showRating={false}
                  />
                ))}
            </div>
          )}

          {/* Meal Selection */}
          <div className="mb-4">
            <select
              value={newMeal}
              onChange={(e) => setNewMeal(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value="" disabled>
                Select a meal
              </option>
              {meals.map((meal) => (
                <option key={meal.meal_id} value={meal.meal_id}>
                  {meal.meal_name}
                </option>
              ))}
            </select>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddMeal}
              disabled={!newMeal}
            >
              Add Meal
            </button>
          </div>

          {/* Display Selected Meal */}
          {visibleMeal && (
            <div className="mt-4 mb-6">
              {meals
                .filter((meal) => meal.meal_id === visibleMeal)
                .map((meal) => (
                  <Meal
                    key={meal.meal_id}
                    mealName={meal.meal_name}
                    onDelete={handleRemoveMeal}
                    isOwn={true}
                    foods={meal.foods}
                    currentRating={meal.rating}
                    ratingCount={meal.rating_count}
                    showRating={false}
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
              disabled={!newWorkout && !newMeal && !postContent}
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

import React, { useContext, useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Post from "../components/Post";
import axios from "axios";
import ExerciseProgram from "../components/ExerciseProgram";
import { Context } from "../globalContext/globalContext";
import { IoIosStar } from "react-icons/io";

const SearchResults = () => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const location = useLocation();
  const searchResults = location.state?.results; 
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users"); // Track the active tab
  const token = localStorage.getItem("token");

  const config = useMemo(() => ({
    headers: {
      "Authorization": "Token " + token,
    },
  }), [token]);

  useEffect(() => {
    // Fetch detailed workout data for each workout_id
    const fetchWorkouts = async () => {
      if (searchResults?.workouts) {
        const workoutPromises = searchResults.workouts.map(async (workout) => {
          try {
            const response = await axios.get(`${baseURL}/get-workout/${workout.workout_id}/`, config);
            return response.data;
          } catch (err) {
            console.error(`Failed to fetch workout ${workout.workout_id}:`, err);
            return null; // Return null if a workout fetch fails
          }
        });

        const detailedWorkouts = await Promise.all(workoutPromises);
        setWorkouts(detailedWorkouts.filter((workout) => workout !== null));
      }
    };

    fetchWorkouts();
  }, [searchResults]);

  if (!searchResults) {
    return (
      <div className="bg-gray-900 text-white p-4 rounded">
        <h3 className="text-lg font-bold">No Results Found</h3>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-4 rounded">
      <h3 className="text-lg font-bold mb-4">Search Results</h3>

      {/* Tab Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["users", "posts", "meals", "workouts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && searchResults.users && searchResults.users.length > 0 && (
        <div className="mb-4">
          
          <div className="flex flex-col gap-4">
            {searchResults.users.map((user) => (
              <div
                key={user.username}
                className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto"
              >
                {/* Header */}
                <div className="flex items-center mb-4 justify-between">
                  <Link to={`/profile/${user.username}`} className="flex items-center">
                    <img
                      src={
                        user.profile_picture
                          ? `${baseURL}/${user.profile_picture}`
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">@{user.username}</h3>
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <IoIosStar
                            key={i}
                            className={i < Math.round(user.score) ? "text-yellow-400" : "text-gray-500"}
                          />
                        ))}
                        <span className="text-gray-300 ml-2">
                          {typeof user.score === "number" ? user.score.toFixed(1) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && searchResults.posts && searchResults.posts.length > 0 && (
        <div className="mb-4">
          
          <div className="flex flex-col gap-4">
            {searchResults.posts.map((post) => (
              <Post
                key={post.id}
                postId={post.post_id}
                user={post.user}
                content={post.content}
                mealId={post.meal_id}
                workoutId={post.workout_id}
                like_count={post.like_count}
                liked={post.liked}
                created_at={post.created_at}
              />
            ))}
          </div>
        </div>
      )}

      {/* Meals Tab */}
      {activeTab === "meals" && searchResults.meals && searchResults.meals.length > 0 && (
        <div className="mb-4">
          
          <ul className="list-disc pl-5">
            {searchResults.meals.map((meal) => (
              <li key={meal.meal_id}>
                {meal.meal_name} - Calories: {meal.calories}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workouts Tab */}
      {activeTab === "workouts" && workouts.length > 0 && (
        <div className="mb-4">
          
          <div className="flex flex-col gap-4">
            {workouts.map((workout) => (
              <div className="h-96 overflow-y-scroll mb-4" key={workout.workout_id}>
                <ExerciseProgram
                  programName={workout.workout_name}
                  exercises={workout.exercises}
                  onDelete={() => {}}
                  isOwn={false}
                  programId={workout.id}
                  currentRating={workout.rating}
                  ratingCount={workout.rating_count}
                  showRating={workout.created_by.username !== localStorage.getItem("username")}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Found for the Active Tab */}
      {activeTab === "users" && (!searchResults.users || searchResults.users.length === 0) && (
        <p>No users found.</p>
      )}
      {activeTab === "posts" && (!searchResults.posts || searchResults.posts.length === 0) && (
        <p>No posts found.</p>
      )}
      {activeTab === "meals" && (!searchResults.meals || searchResults.meals.length === 0) && (
        <p>No meals found.</p>
      )}
      {activeTab === "workouts" && workouts.length === 0 && <p>No workouts found.</p>}
    </div>
  );
};

export default SearchResults;

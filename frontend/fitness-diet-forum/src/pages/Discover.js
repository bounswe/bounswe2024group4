import React, { useEffect, useState, useContext } from "react";
import { Context } from "../globalContext/globalContext.js";
import { Link } from "react-router-dom"; // Import Link component from react-router-dom
import axios from "axios";

const Discover = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      'Authorization': 'Token ' + token,
    },
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log('hi');
        const [mealActivities, workoutActivities, workoutLogActivities] = await Promise.all([
          axios.get(baseURL + "/get_meal_activities/", config),
          axios.get(baseURL + "/workout-activities/", config),
          axios.get(baseURL + "/get-workout-log-activities/", config)
        ]);

        const allActivities = [
          ...mealActivities.data.activities,
          ...workoutActivities.data.activities,
          ...workoutLogActivities.data.activities,
        ];

        const sortedActivities = allActivities.sort((a, b) => {
          // Convert 'published' to Date objects for comparison
          const dateA = new Date(a.published);
          const dateB = new Date(b.published);

          // Sort in descending order (most recent first)
          return dateB - dateA;
        });

        // Now `sortedActivities` is the array sorted by 'published' descending
        setActivities(sortedActivities.slice(0, 50));
        console.log(activities);
      } catch (err) {
        console.log(err);
        setError("Failed to load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [baseURL]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <div className="space-y-4">
        {activities.map((activity, index) => {
          // Split the summary to get the username and action
          const summary = activity.summary.split(" ");
          const username = summary[0]; // Extract the username (first word)
          let action = summary.slice(1).join(" "); // The rest is the action

          // Replace 'logged' with 'completed' in the action
          action = action.replace('logged', 'completed');

          // Determine the icon based on the activity type and object type
          let icon = '';
          if (activity.type === 'Create') {
            if (activity.object.type === 'Workout') {
              icon = '🏋️'; // Workout creation
            } else if (activity.object.type === 'Meal') {
              icon = '🍽️'; // Meal creation
            }
          } else if (activity.type === 'Log') {
            icon = '🏅'; // Changed to a fitness-related symbol (e.g., Medal for completing a workout)
          }

          return (
            <div
              key={index}
              className="bg-white shadow-md p-4 rounded-lg flex items-start space-x-4 border border-gray-200"
            >
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-3xl">
                  {icon}
                </div>
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  {/* Use Link for username */}
                  <Link to={`/profile/${username}`} className="text-blue-500 hover:underline">
                    {username}
                  </Link>
                  {/* Display the action (rest of the summary) */}
                  <span className="text-gray-700"> {action}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(activity.published).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Discover;

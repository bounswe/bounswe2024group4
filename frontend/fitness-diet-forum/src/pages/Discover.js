import React, { useEffect, useState } from "react";
import axios from "axios";

const Discover = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Mock API response
        const mockData = [
          {
            user: "Alice Johnson",
            time: "2024-12-11T10:15:30Z",
            action: "Uploaded a new photo to the gallery.",
          },
          {
            user: "Bob Smith",
            time: "2024-12-11T12:45:00Z",
            action: "Commented on your post: 'Great work! Keep it up.'",
          },
          {
            user: "Charlie Davis",
            time: "2024-12-10T18:30:15Z",
            action: "Joined the group 'Photography Enthusiasts'.",
          },
          {
            user: "Dana Lee",
            time: "2024-12-09T15:00:00Z",
            action: "Liked your post about 'Traveling to Paris'.",
          },
          {
            user: "Ethan Brown",
            time: "2024-12-08T20:45:30Z",
            action: "Started following you.",
          },
        ];
        setActivities(mockData);
      } catch (err) {
        setError("Failed to load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchActivities();
  }, []);
  

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-4 rounded-lg flex items-start space-x-4 border border-gray-200"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {activity.user.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-gray-800 font-medium">
                {activity.user}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(activity.time).toLocaleString()}
              </p>
              <p className="mt-2 text-gray-700">{activity.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";
import Post from "../components/Post.js";

const Feed = () => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const loggedInUser = localStorage.getItem("username"); // Get logged-in user
  const csrf_token = localStorage.getItem("csrfToken"); // Get CSRF token if needed

  const [posts, setPosts] = useState([]); // State to hold the posts
  const [error, setError] = useState(null); // State to hold errors

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        // Send GET request to the following_feed endpoint with the logged-in username
        const response = await axios.get(`${baseURL}/following_feed`, {
          params: { username: loggedInUser },
          headers: {
            "Authorization": `Bearer ${csrf_token}` // If token is needed in headers
          }
        });

        if (response.status === 200) {
          setPosts(response.data.posts); // Assuming response contains the posts array
        } else {
          setError("Failed to fetch posts");
        }
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      }
    };

    fetchFeed();
  }, [baseURL, loggedInUser, csrf_token]);

  return (
    <div className="feed-container">
      <h2>Your Feed</h2>
      {/* Display error message if there's an error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Render posts */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            user={post.user} // Assuming each post has a user object
            content={post.content}
            mealId={post.meal_id} // Assuming mealId is part of the post
            workoutId={post.workout_id} // Assuming workoutId is part of the post
          />
        ))
      ) : (
        <div>No posts found</div> // Display if no posts are available
      )}

      <style>
        {`
          .feed-container {
            background-color: #1c1f26; /* Dark background */
            color: white;
            padding: 20px;
            margin: 0;
            max-width: 100vw; /* Make sure it takes up the full width */
            height: 100vh; /* Fill the screen height */
            overflow-y: auto; /* Enable scroll if the content overflows */
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background-color: #1c1f26; /* Dark background for the entire page */
          }

          .main-content {
            margin-left: 240px; /* For sidebar */
            padding: 20px;
          }

          h2 {
            font-size: 2rem;
            margin-bottom: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default Feed;

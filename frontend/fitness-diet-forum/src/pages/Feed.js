import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";
import Post from "../components/Post.js";

const Feed = () => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const loggedInUser = localStorage.getItem("username"); // Get logged-in user
  const token = localStorage.getItem("token"); // Get CSRF token if needed

  const [posts, setPosts] = useState([]); // State to hold the posts
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]); // State to hold bookmarked posts
  const [error, setError] = useState(null); // State to hold errors
  const [activeTab, setActiveTab] = useState("feed"); // Manage active tab: "feed" or "bookmarked"

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(`${baseURL}/following_feed/`, {
          headers: {
            "Authorization": `Token ${token}` 
          }
        });

        if (response.status === 200) {
          setPosts(response.data.posts);
          //console.log(response.data); 
        } else {
          setError("Failed to fetch posts");
        }
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      }
    };

    const fetchBookmarkedPosts = async () => {
      try {
        const response = await axios.get(`${baseURL}/bookmarked_posts/`, {
          headers: {
            "Authorization": `Token ${token}`
          }
        });

        if (response.status === 200) {
          setBookmarkedPosts(response.data.bookmarked_posts);
          //console.log(response.data);
        } else {
          setError("Failed to fetch bookmarked posts");
        }
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      }
    };

    if (activeTab === "feed") {
      fetchFeed();
    } else if (activeTab === "bookmarked") {
      fetchBookmarkedPosts();
    }
  }, [baseURL, loggedInUser, token, activeTab]);

  return (
    <div className="feed-container">
      <h2>Your Feed</h2>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "feed" ? "active" : ""}`}
          onClick={() => setActiveTab("feed")}
        >
          Feed
        </button>
        <button
          className={`tab-button ${activeTab === "bookmarked" ? "active" : ""}`}
          onClick={() => setActiveTab("bookmarked")}
        >
          Bookmarked Posts
        </button>
      </div>

      {/* Display error message if there's an error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Render posts based on active tab */}
      {activeTab === "feed" && posts.length > 0 ? (
        posts.map((post) => (
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
        ))
      ) : activeTab === "bookmarked" && bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post) => (
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

          .tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }

          .tab-button {
            padding: 10px 20px;
            margin: 0 10px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .tab-button.active {
            background-color: #007bff;
            color: white;
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


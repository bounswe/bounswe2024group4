import React, { useState, useEffect, useContext } from "react";
import "../css/index.css";
import { Navbar } from "../components/Navbar";
import Post from "../components/Post.js";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";

const Feed = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const handleData = async () => {
    try {
      const response = await axios.get(baseURL + "/feed/");
      console.log(response);
      setFeedPosts(response.data.post_ids);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="bg-sky-50 min-h-screen">
      <Navbar />
      <div className="flex container mx-auto mt-[5vh] gap-8">
        <div className="w-full p-4 mx-40 mt-6 mb-12">
          <div className="bg-white p-6 rounded-2xl overflow-auto shadow h-full">
            <h1 className="text-2xl font-bold mb-6"> Feed </h1>
            {feedPosts.length > 0 ? (
              feedPosts.map((post) => <Post key={post} postId={post} />)
            ) : (
              <p className="text-center text-gray-500">
                There are nothing to show in your feed.Follow users or post
                something.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;

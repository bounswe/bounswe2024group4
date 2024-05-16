import React, { useState, useEffect, useContext } from "react";
import "../css/index.css";
import { Navbar } from "../components/Navbar";
import Post from "../components/Post.js";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const handleData = async () => {
    try {
      const response = await axios.get(baseURL + "/get_bookmarked_post_ids/");
      console.log(response);
      setBookmarkedPosts(response.data.posts);
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
        <div className="w-full p-4 mx-40 mt-8 mb-10">
          <div className="bg-white p-6 rounded-2xl overflow-auto shadow h-full">
            <h1 className="text-2xl font-bold mb-4"> Bookmarked Posts </h1>
            {bookmarkedPosts.length > 0 ? (
              bookmarkedPosts.map((post) => (
                <Post key={post.post_id} postId={post.post_id} />
              ))
            ) : (
              <p className="text-center text-gray-500">You have no bookmarked posts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
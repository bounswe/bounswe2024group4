import React, { useContext, useState, useEffect } from "react";
import "../css/index.css";
import { Navbar } from "../components/Navbar";
import Post from "../components/Post.js";
import Comment from "../components/Comment.js";
import { Context } from "../globalContext/globalContext.js";
import { useParams } from "react-router-dom";
import { isAuthorized } from "../components/Auth.js";
import axios from "axios";
import Cookies from "js-cookie";

const PostFocus = () => {
  const { id } = useParams();
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [written, setWritten] = useState({
    content: '',
    comment_user_pp: '',
    comment_username: ''
  });

  const updateComments = (newComments) => {
      setComments(newComments);
  };

  const handleCommentSubmit = async () => {
    if (!isAuthorized()) {
      return;
    }
    const prevComments = comments;
    setComments([...comments, written]);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    const formData = new FormData();
    if (written.content) formData.append("content", written.content);

    try {
      const response = await axios.post(
        baseURL + "/post/" + id + "/comment/",
        formData,
        config
      );
      if (response.status !== 200) {
        setComments(prevComments);
      }
    } catch (error) {
      console.error("Error commenting:", error);
      setComments(prevComments);
    }
  };

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
      setWritten({});
      setWritten({ content: '', comment_user_pp: '', comment_username: '' });
    }
  };

  useEffect(() => {    
    setAuthor(localStorage.getItem("username"));
  },[]);

  return (
    <div className="bg-sky-50 min-h-screen">
      <Navbar />
      <div className="flex mt-[5vh] gap-8">
        <div className="flex w-10/12 p-4 h-min rounded-3xl bg-white ml-32 border border-slate-150">
          <div className="w-full p-4 h-min rounded-3xl bg-white">
            <Post
              className="w-full relative"
              key={id}
              postId={id}
              updateComments={updateComments}
            />
          </div>
          <div className="container p-4">
            {comments && <div className="p-2 mb-3 border max-h-[50vh] border-gray-300 rounded-lg bg-white overflow-auto">
              {comments.map((comment, index) => (
                <Comment
                  key={index}
                  content={comment.content}
                  profilePicture={baseURL + comment.comment_user_pp}
                  username={comment.comment_username}
                  commentId={comment.id}
                  initialIsLiked={comment.liked_by_user}
                  initialLikesCount={comment.likes_count}
                />
              ))}
            </div>}
            <textarea
              className="w-full p-2 border rounded-lg"
              placeholder="What's on your mind?"
              value={written.content}
              onChange={(e) => setWritten({ ...written, content: e.target.value, comment_username: author })}
              onKeyDown={handleTextareaKeyDown}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFocus;

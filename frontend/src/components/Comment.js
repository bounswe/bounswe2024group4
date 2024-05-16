import React, { useContext, useState } from "react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { Context } from "../globalContext/globalContext.js";
import Cookies from "js-cookie";
import axios from "axios";

function Comment({ content, username, profilePicture, commentId, initialIsLiked, initialLikesCount }) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const handleLike = async () => {
    // Store the previous values in case of reverting back
    const previousLikesCount = likesCount;
    const previousIsLiked = isLiked;
    // Optimistically update the like state so we don't wait for the server
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const response = await axios.post(
        baseURL + "/like_or_unlike_comment/" + commentId,
        "",
        config
      );
      if (response.status !== 200) {
        // Like is not accepted by the server, revert back
        setLikesCount(previousLikesCount);
        setIsLiked(previousIsLiked);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      setLikesCount(previousLikesCount);
      setIsLiked(previousIsLiked);
    }
  };

  return (
    <div className="rounded-lg border-slate-150 overflow-hidden mb-1">
      <div className="bg-white shadow-md p-4 hover:bg-slate-50">
        <div className="flex gap-4">
          <img
            src={profilePicture}
            className="w-12 h-12 rounded-full border border-gray-300 object-cover object-center"
          />
          <div className="w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-black">{username}</h2>
              </div>
            </div>
            <div className="flex relative">
              <p className="text-gray-800">{content}</p>
              <div className="flex items-center relative justify-end grow">
                <div className="group flex items-center ml-6">
                  {isLiked ? (
                    <HeartIconSolid
                      className="w-6 h-6 text-red-500 mr-1 cursor-pointer group-hover:text-red-500"
                      onClick={handleLike}
                    />
                  ) : (
                    <HeartIconOutline
                      className="w-6 h-6 text-gray-500 mr-1 cursor-pointer rounded-full group-hover:text-red-500 group-hover:bg-red-100"
                      onClick={handleLike}
                    />
                  )}
                  <span
                    className={`${
                      isLiked
                        ? "text-red-500"
                        : "text-gray-500 group-hover:text-red-500"
                    }`}
                  >
                    {likesCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;

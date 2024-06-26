import React, { useContext, useState, useEffect } from "react";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleOvalLeftEllipsisIcon,
  BookmarkIcon as BookmarkIconOutline,
} from "@heroicons/react/24/outline";
import { formatDistanceToNowStrict } from "date-fns";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import UserListInfoModal from "../components/UserListInfoModal.js";

function Post({ postId, updateComments }) {
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [author, setAuthor] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [profilePicture, setProfilePicture] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likers, setLikers] = useState([]);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const navigate = useNavigate();

  const parseContentWithHyperlinks = (content) => {
    // Check if content is defined and not empty
    if (!content || content.trim() === "") return null;

    // Regular expression to match anchor tags with href attribute
    const anchorRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/g;

    // Extract URLs and anchor text from content
    const parts = [];
    let match;
    let lastIndex = 0;
    while ((match = anchorRegex.exec(content)) !== null) {
      // Push preceding text as plain text
      parts.push(content.slice(lastIndex, match.index));
      // Push URL and anchor text
      parts.push({
        url: match[1], // URL
        text: match[2], // Anchor text
      });
      lastIndex = anchorRegex.lastIndex;
    }
    // Push remaining text after the last match
    parts.push(content.slice(lastIndex));

    // Render content with clickable links
    return parts.map((part, index) => {
      if (typeof part === "string") {
        // Plain text
        return part;
      } else {
        // Anchor text, render as clickable link
        return (
          <span
            key={index}
            onClick={() => window.open(part.url, "_blank")}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {part.text}
          </span>
        );
      }
    });
  };

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
        baseURL + "/like_or_unlike_post/" + postId,
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

  const handleBookmark = async () => {
    // Store the previous value in case of reverting back
    const previousBookmarked = isBookmarked;
    // Optimistically update the bookmark state so we don't wait for the server
    setIsBookmarked((prev) => !prev);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };

    try {
      const response = await axios.post(
        baseURL + "/bookmark_or_unbookmark_post/" + postId,
        "",
        config
      );
      if (response.status !== 200) {
        // Bookmark is not accepted by the server, revert back
        setIsBookmarked(previousBookmarked);
      }
    } catch (error) {
      console.error("Error bookmarking the post:", error);
      setIsBookmarked(previousBookmarked);
    }
  };

  const handleProfilePictureClick  = () => {
    navigate("/user/" + author);
  };

  const handleData = async () => {
    try {
      const response = await axios.get(
        baseURL + "/post_detail/" + postId + "/"
      );
      console.log(response);
      setContent(response.data.post);
      if (response.data.image == null) {
        setImageURL(null);
      } else {
        setImageURL(baseURL + response.data.image);
      }
      setCreatedAt(
        formatDistanceToNowStrict(response.data.created_at, { addSuffix: true })
      );
      setIsLiked(response.data.user_has_liked);
      setLikesCount(response.data.likes_count);
      setIsBookmarked(response.data.user_has_bookmarked);
      setAuthor(response.data.username);
      setProfilePicture(baseURL + response.data.profile_picture);
      if (updateComments) updateComments(response.data.comments);
      setCommentCount(response.data.comments.length);
      const likersResponse = await axios.get(
        baseURL + "/get_users_like_post/" + postId
      );
      setLikers(likersResponse.data.user_info.map(info => info.username));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handleData();
  }, [postId]);

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden mb-2">
      <div className="bg-white shadow-md p-4 hover:bg-slate-50">
        <div className="flex gap-4">
          <img
            src={profilePicture}
            className="w-12 h-12 aspect-square rounded-full border border-gray-300 object-cover object-center"
            onClick={handleProfilePictureClick}
          />
          <div className="w-full">
            <div className="flex items-center mb-2 gap-2">
              <div className="flex items-center gap-2">
                <Link to={`/user/${author}`}>
                  <h2 className="text-lg font-semibold">{author}</h2>
                </Link>
                <p className="text-gray-500 text-sm">{createdAt}</p>
              </div>
            </div>
              <p className="text-gray-800 mb-4">
                {parseContentWithHyperlinks(content)}
              </p>
              <Link to={`/post/${postId}`}>
                {imageURL && (
                  <img
                    src={imageURL}
                    alt=""
                    className="rounded-3xl mb-4 object-cover border min-w-96 max-h-[55vh]"
                  />
                )}
              </Link>
            <div className="flex items-center relative">
              <div className="group flex items-center mr-4">
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
                  }`} onClick={() => setIsModalOpen(true)}
                >
                  {likesCount}
                </span>
              </div>
              <Link to={`/post/${postId}`}>
                <div className="group flex items-center mr-4">
                  <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-gray-500 mr-1 cursor-pointer rounded-full group-hover:text-blue-500 group-hover:bg-blue-100" />
                  <span className="text-gray-600 group-hover:text-blue-500">
                    {commentCount}
                  </span>
                </div>
              </Link>
              <div className="group flex items-center mr-4 absolute right-0">
                {isBookmarked ? (
                  <BookmarkIconSolid
                    className="w-6 h-6 text-blue-500 mr-1 cursor-pointer group-hover:text-blue-500"
                    onClick={handleBookmark}
                  />
                ) : (
                  <BookmarkIconOutline
                    className="w-6 h-6 text-gray-500 mr-1 cursor-pointer rounded-full object-left group-hover:text-blue-500 group-hover:bg-blue-100"
                    onClick={handleBookmark}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserListInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        usernames={likers}
        title="People who liked this post"
      />
    </div>
  );
}

export default Post;

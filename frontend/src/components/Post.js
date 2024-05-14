import React, { useContext, useState, useEffect, useRef } from 'react';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline, ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import {formatDistanceToNowStrict} from "date-fns";
import { Context } from "../globalContext/globalContext.js";
import axios from 'axios';
import { InView } from 'react-intersection-observer';
import Cookies from 'js-cookie';

function Post({ postId }) {
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [author, setAuthor] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;

  const handleLike = async () => {
    // Store the previous values in case of reverting back
    const previousLikesCount = likesCount;
    const previousIsLiked = isLiked;
    // Optimistically update the like state so we don't wait for the server
    setLikesCount((prev) => isLiked ? prev - 1 : prev + 1);
    setIsLiked((prev) => !prev);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    };
  
    try {
      const response = await axios.post(baseURL + '/like_or_unlike_post/' + postId, '', config);
      if (response.status !== 200) {
        // Like is not accepted by the server, revert back
        setLikesCount(previousLikesCount);
        setIsLiked(previousIsLiked);
      }
    } catch (error) {
      console.error('Error liking the post:', error);
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
      const response = await axios.post(baseURL + '/bookmark_or_unbookmark_post/' + postId, '', config);
      if (response.status !== 200) {
        // Bookmark is not accepted by the server, revert back
        setIsBookmarked(previousBookmarked);
      }
    } catch (error) {
      console.error('Error bookmarking the post:', error);
      setIsBookmarked(previousBookmarked);
    }
  };

  const handleData = async () => {
    try {
      const response = await axios.get(baseURL + '/post_detail/' + postId + '/');
      console.log(response);
      setContent(response.data.post);
      setImageURL(baseURL + response.data.image);
      setCreatedAt(formatDistanceToNowStrict(response.data.created_at, { addSuffix: true }));
      setIsLiked(response.data.user_has_liked);
      setLikesCount(response.data.likes_count);
      setIsBookmarked(response.data.user_has_bookmarked);
      setAuthor(response.data.username);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    handleData();
  }, [postId])

	return (
		<div className="border border-gray-300 rounded-md overflow-hidden mb-2">
			<div className="bg-white shadow-md p-4 hover:bg-slate-50">
        <div className='flex gap-4'>
          {/* <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full" /> */}
          <div className='w-full'>
            <div className="flex items-center mb-2 gap-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{author}</h2>
                    <p className="text-gray-500 text-sm">{createdAt}</p>
                </div>
            </div>
            <p className="text-gray-800 mb-4">{content}</p> 
            {imageURL && 
                <img src={imageURL} alt="" className="rounded-3xl mb-4 object-cover min-w-96 max-h-[55vh]" />
            }
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
                <span className={`${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>
                    {likesCount}
                </span>
            </div>
            <div className="group flex items-center mr-4">
                <ChatBubbleOvalLeftEllipsisIcon
                    className="w-6 h-6 text-gray-500 mr-1 cursor-pointer rounded-full group-hover:text-blue-500 group-hover:bg-blue-100"
                />
                <span className="text-gray-600 group-hover:text-blue-500">
                    {/* {commentCount} */}
                </span>
            </div>
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
		</div>
	);
}

export default Post;
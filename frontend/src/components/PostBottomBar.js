import React, { useState } from 'react';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline, ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";

function PostBottomBar() {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    const handleLikeToggle = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
    }

    const handleBookmarkToggle = () => {
        setBookmarked(!bookmarked);
    }

    return (
        <div className="flex items-center relative">
            <div className="group flex items-center mr-4">
                {liked ? (
                    <HeartIconSolid 
                        className="w-6 h-6 text-red-500 mr-1 cursor-pointer group-hover:text-red-500" 
                        onClick={handleLikeToggle} 
                    />
                ) : (
                    <HeartIconOutline 
                        className="w-6 h-6 text-gray-500 mr-1 cursor-pointer rounded-full group-hover:text-red-500 group-hover:bg-red-100" 
                        onClick={handleLikeToggle}
                    />
                )}
                <span className={`${liked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>
                    {likeCount}
                </span>
            </div>
            <div className="group flex items-center mr-4">
                <ChatBubbleOvalLeftEllipsisIcon
                    className="w-6 h-6 text-gray-500 mr-1 cursor-pointer rounded-full group-hover:text-blue-500  group-hover:bg-blue-100"
                />
                <span className="text-gray-600 group-hover:text-blue-500">
                    {commentCount}
                </span>
            </div>
            <div className="group flex items-center mr-4 absolute right-0">
                {bookmarked ? (
                    <BookmarkIconSolid 
                        className="w-6 h-6 text-blue-500 mr-1 cursor-pointer group-hover:text-blue-500" 
                        onClick={handleBookmarkToggle} 
                    />
                ) : (
                    <BookmarkIconOutline 
                        className="w-6 h-6 text-gray-500 mr-1 cursor-pointer rounded-full object-left group-hover:text-blue-500 group-hover:bg-blue-100" 
                        onClick={handleBookmarkToggle}
                    />
                )}
            </div>
        </div>
    )
}

export default PostBottomBar;
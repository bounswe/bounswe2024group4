import React, { useState } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import Food from "../components/Food"; // Import the Food component

const Post = ({ user, title, bodyContent, meals }) => {
    // State for like functionality
    const [liked, setLiked] = useState(false); // Initially not liked
    const [likeCount, setLikeCount] = useState(0); // Initial like count

    // State for comments
    const [showCommentBox, setShowCommentBox] = useState(false); // Hide comment box initially
    const [newComment, setNewComment] = useState(""); // Track new comment input
    const [comments, setComments] = useState([]); // List of comments

    // Handle like button click
    const handleLikeClick = () => {
        setLiked(!liked); // Toggle like state
        setLikeCount(likeCount + (liked ? -1 : 1)); // Increase or decrease like count
    };

    // Handle comment submit
    const handleCommentSubmit = (e) => {
        e.preventDefault(); // Prevent default form behavior
        if (newComment.trim()) {
            setComments([...comments, newComment]); // Add new comment to the list
            setNewComment(""); // Clear comment input
            setShowCommentBox(false); // Hide the comment box after submission
        }
    };

    return (
        <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-4">
                <img
                    src={user.profilePic} // Dynamically loads profile picture
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                    <h3 className="text-xl font-semibold">{user.name} {user.surname} @{user.username}</h3>
                    <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <IoIosStar key={i} className={i < user.rating ? "text-yellow-400" : "text-gray-500"} />
                        ))}
                        <span className="text-gray-300 ml-2">{user.rating}</span>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <div className="mb-4">{bodyContent}</div> {/* Body content can be text or an image */}

            {/* Scrollable List of Food Components (Meals) */}
            <div className="h-96 overflow-y-scroll mb-4">
                {meals.map((meal, index) => (
                    <Food
                        key={index}
                        foodName={meal.foodName}
                        calories={meal.calories}
                        protein={meal.protein}
                        carbs={meal.carbs}
                        fat={meal.fat}
                        ingredients={meal.ingredients}
                        ingredientAmounts={meal.ingredientAmounts}
                        imageUrl={meal.imageUrl}
                        recipeUrl={meal.recipeUrl}
                    />
                ))}
            </div>

            {/* Actions: Like & Comment */}
            <div className="flex justify-between mt-4 text-gray-400">
                <button className="flex items-center" onClick={handleLikeClick}>
                    <FaHeart className={`mr-2 ${liked ? "text-red-500" : ""}`} /> {likeCount} Like
                </button>
                <button className="flex items-center" onClick={() => setShowCommentBox(!showCommentBox)}>
                    <FaComment className="mr-2" /> Comment
                </button>
            </div>

            {/* Comment Box */}
            {showCommentBox && (
                <form className="mt-4" onSubmit={handleCommentSubmit}>
                    <textarea
                        className="w-full p-2 rounded-lg bg-gray-800 text-white"
                        rows="3"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Publish
                    </button>
                </form>
            )}

            {/* Display Comments */}
            {comments.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Comments:</h4>
                    <ul>
                        {comments.map((comment, index) => (
                            <li key={index} className="mb-2">
                                {comment}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Post;

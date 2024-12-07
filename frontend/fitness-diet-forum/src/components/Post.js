import React, { useContext, useState, useEffect } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import ExerciseProgram from "./ExerciseProgram";
import Meal from "./Meal";
import { Context } from "../globalContext/globalContext.js";
import axios from 'axios';
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Post = ({ postId, user, content, mealId, workoutId, like_count }) => {
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const loggedInUser = localStorage.getItem("username");
    const csrf_token = localStorage.getItem("csrfToken");
    const [error, setError] = useState(null);

    const [workout, setWorkout] = useState(null);
    const [meal, setMeal] = useState(null);

    const [liked, setLiked] = useState(false); // Initially not liked
    const [likeCount, setLikeCount] = useState(like_count); // Initial like count
    const [showCommentBox, setShowCommentBox] = useState(false); // Hide comment box initially
    const [newComment, setNewComment] = useState(""); // Track new comment input
    const [comments, setComments] = useState([]); // List of comments

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                if (mealId) {
                    // TO DO get meal with meal ID
                }
                if (workoutId) {
                    const workoutResponse = await axios.get(baseURL + `/get-workout/${workoutId}`);
                    console.log(workoutResponse);
                    if (workoutResponse.status === 200) {
                        const data = workoutResponse.data;
                        console.log(data);
                        setWorkout(data);
                    } else {
                        setError('Workout not found');
                    }
                }
            } catch (error) {
                setError('Something went wrong');
            }
        };
        fetchPostData();
    }, [mealId, workoutId]);

    const handleLikeClick = async () => {
        try {
            // Optimistically update UI
            setLiked(!liked);
            setLikeCount(likeCount + (liked ? -1 : 1));
            console.log('Post ID: ' + postId);
            // Send a request to toggle like
            const response = await axios.post(
                `${baseURL}/toggle_like/`, 
                {
                    postId: postId,
                    username: loggedInUser
                },
            );
    
            if (response.status === 200) {
                console.log(response.data.message); // Post liked/unliked successfully
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert UI state if request fails
            setLiked(!liked);
            setLikeCount(likeCount - (liked ? -1 : 1));
        }
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
                {/* Wrap profile picture and username in Link */}
                <Link to={`/profile/${user.username}`} className="flex items-center">
                    <img
                        src={user.profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} // Dynamically loads profile picture
                        alt="Profile"
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">@{user.username}</h3>
                        <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <IoIosStar key={i} className={i < user.score ? "text-yellow-400" : "text-gray-500"} />
                            ))}
                            <span className="text-gray-300 ml-2">{user.score}</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Post Content */}
            <div className="mb-4">{content}</div> {/* Body content can be text or an image */}

            {/* Meal */}
            {meal && (
                <div className="h-96 overflow-y-scroll mb-4">
                    <Meal
                        mealName={""}
                        foods={[]}
                        onDelete={() => {}}
                        key={1}
                        isOwn={false}
                    />
                </div>
            )}

            {/* ExerciseProgram */}
            {workout && (
                <div className="h-96 overflow-y-scroll mb-4">
                    <ExerciseProgram
                        programName={workout.workout_name}
                        exercises={workout.exercises}
                        onDelete={() => {}}
                        isOwn={false}
                        programId={workout.id}
                        currentRating={workout.rating}
                        ratingCount={workout.rating_count}
                        showRating={true}
                    />
                </div>
            )}

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

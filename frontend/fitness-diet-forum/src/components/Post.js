import React, { useContext, useState, useEffect, useMemo } from "react";
import { FaHeart, FaComment, FaBookmark } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import ExerciseProgram from "./ExerciseProgram";
import Meal from "./Meal";
import { Context } from "../globalContext/globalContext.js";
import axios from 'axios';
import { Link } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";

const Post = ({ postId, user, content, mealId, workoutId, like_count, liked, created_at }) => {
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const token = localStorage.getItem("token");

    const [error, setError] = useState(null);
    const [workout, setWorkout] = useState(null);
    const [meal, setMeal] = useState(null);

    const createdDate = formatDistanceToNowStrict(created_at, { addSuffix: true });
    const [hasLiked, setHasLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(like_count);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);

    const config = useMemo(() => ({
        headers: {
          'Authorization': 'Token ' + token,
        },
      }), [token]);

    useEffect(() => {
        const fetchPostData = async () => {
            try {


                if (mealId) {
                    // TODO: Fetch meal data using mealId if needed
                }

                if (workoutId) {
                    const workoutResponse = await axios.get(baseURL + `/get-workout/${workoutId}`, config);
                    if (workoutResponse.status === 200) {
                        setWorkout(workoutResponse.data);
                    } else {
                        setError('Workout not found');
                    }
                }

                // Fetch bookmark status
                const bookmarkResponse = await axios.get(baseURL + "/bookmarked_posts/", config);
                if (bookmarkResponse.status === 200) {
                    const bookmarkedPostIds = bookmarkResponse.data.bookmarked_posts.map(post => post.post_id);
                    setIsBookmarked(bookmarkedPostIds.includes(postId));
                }
            } catch (error) {
                setError('Something went wrong');
            }
        };
        const fetchComments = async () => {
            if (!postId) return;
            try {
              const response = await axios.get(`${baseURL}/get_comments/?postId=${postId}`, config);
              if (response.status === 200) {
                setComments(response.data.comments);
              }
            } catch (error) {
              console.error("Error fetching comments:", error);
            }
          };
        fetchPostData();
        fetchComments();
    }, [mealId, workoutId, hasLiked, baseURL, config, postId]);

    const handleLikeClick = async () => {
        const updatedHasLiked = !hasLiked;
        const updatedLikeCount = likeCount + (hasLiked ? -1 : 1);

        // Optimistically update UI
        setHasLiked(updatedHasLiked);
        setLikeCount(updatedLikeCount);

        try {
            const response = await axios.post(
                `${baseURL}/toggle_like/`, 
                { postId }, 
                config
            );

            if (response.status !== 200) {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert on error
            setHasLiked(hasLiked);
            setLikeCount(likeCount);
        }
    };

    const toggleBookmark = async () => {
        try {
            const updatedIsBookmarked = !isBookmarked;
            setIsBookmarked(updatedIsBookmarked);

            const response = await axios.post(
                `${baseURL}/toggle_bookmark/`,
                { postId },
                config
            );
            if (response.status !== 200) {
                throw new Error("Unexpected response");
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            setIsBookmarked(!isBookmarked);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                const response = await axios.post(
                    `${baseURL}/comment/`,
                    { postId, content: newComment },
                    config
                );
                if (response.status === 201) {
                    // Successfully created comment on backend
                    // Add the new comment to the local state
                    const comment_id = response.data.comment_id;
                    setComments(prevComments => [...prevComments, { id: comment_id, content: newComment }]);
                    setNewComment("");
                    setShowCommentBox(false);
                }
            } catch (error) {
                console.error('Error creating comment:', error);
            }
        }
    };

    return (
        <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-4 justify-between"> 
                <Link to={`/profile/${user.username}`} className="flex items-center">
                    <img
                        src={user.profile_picture ? `${baseURL}/${user.profile_picture}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">@{user.username}</h3>
                        <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <IoIosStar key={i} className={i < user.score ? "text-yellow-400" : "text-gray-500"} />
                            ))}
                            <span className="text-gray-300 ml-2">{user.score.toFixed(1)}</span>
                        </div>
                    </div>
                </Link>

                <p className="text-gray-500 text-sm">
                    {createdDate}
                </p>
            </div>

            {/* Post Content */}
            <div className="mb-4">{content}</div>

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

            {/* Actions: Like & Bookmark */}
            <div className="flex justify-between mt-4 text-gray-400">
                <button className="flex items-center" onClick={handleLikeClick}>
                    <FaHeart className={`mr-2 ${hasLiked ? "text-red-500" : ""}`} /> {likeCount} Like
                </button>

                <button className="flex items-center" onClick={() => setShowCommentBox(!showCommentBox)}>
                    <FaComment className="mr-2" /> Comment
                </button>
                
                <button
                    className={`flex items-center ${isBookmarked ? "text-yellow-400" : "text-gray-400"}`}
                    onClick={toggleBookmark}
                >
                    <FaBookmark className={`mr-2`} /> Bookmark
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
                        {comments.map((comment) => (
                    <li key={comment.id} className="mb-2">
                    <Link
                    to={`/profile/${comment.username}`}
                    className="font-semibold text-blue-400 hover:underline mr-2"
                    >
            @{comment.username}
          </Link>
          {comment.content}
        </li>
      ))}
    </ul>
  </div>
)}

        </div>
    );
};

export default Post;



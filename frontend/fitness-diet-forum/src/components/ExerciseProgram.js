import React, { useState, useContext, useEffect } from "react";
import Exercise from "./Exercise";
import axios from "axios";
import "../css/index.css";
import { Context } from "../globalContext/globalContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";


const ExerciseProgram = ({ programName, exercises, onDelete, isOwn, programId, currentRating, ratingCount, showRating }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [message, setMessage] = useState(null);
    const [averageRating, setAverageRating] = useState(currentRating);
    const [totalRatings, setTotalRatings] = useState(ratingCount);
    const [isBookmarked, setIsBookmarked] = useState(false); // Bookmark state
    const [username, setUsername] = useState(""); // Username state
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            'Authorization': 'Token ' + token
        },
    }

    // Fetch username and bookmark status
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);

            // Fetch all bookmarked workouts
            const fetchBookmarkedWorkouts = async () => {
                try {
                    const response = await axios.get(`${baseURL}/get-bookmarked-workouts/`, config);

                    if (response.status === 200) {
                        // Check if the current workout is bookmarked
                        const bookmarkedWorkoutIds = response.data.map(workout => workout.id);
                        setIsBookmarked(bookmarkedWorkoutIds.includes(programId));
                    }
                } catch (error) {
                    console.error("Error fetching bookmarked workouts:", error);
                }
            };

            fetchBookmarkedWorkouts();
        } else {
            console.error("Username not found in localStorage.");
        }
    }, [baseURL, programId]);

    // Toggle Bookmark Function
    const toggleBookmarkWorkout = async () => {
        if (!username) {
            setMessage("Username is required to bookmark a workout.");
            return;
        }

        try {
            const response = await axios.post(baseURL + "/workouts/toggle-bookmark/", {
                workout_id: programId,
            }, config);

            if (response.status === 200) {
                const { message } = response.data;
                setMessage(message);

                // Toggle bookmark state
                setIsBookmarked((prev) => !prev);
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            setMessage("Failed to toggle bookmark. Please try again.");
        }
    };

    const handleRatingSubmit = async () => {
        try {
            const response = await axios.post(baseURL + "/rate-workout/", {
                workout_id: programId,
                rating: rating,
            }, config);

            if (response.status === 200) {
                setMessage("Rating submitted successfully!");
                const newTotalRatings = totalRatings + 1;
                const newAverageRating =
                    (averageRating * totalRatings + rating) / newTotalRatings;

                setTotalRatings(newTotalRatings);
                setAverageRating(newAverageRating);
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            setMessage("Failed to submit rating. Please try again.");
        }
    };

    return (
        <div className="relative w-full bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-6 text-lightText flex flex-col">
            {/* Bookmark Button */}
            <button
                className="absolute top-4 right-4 text-2xl hover:text-yellow-400 transition-all duration-300"
                onClick={toggleBookmarkWorkout}
                aria-label="Bookmark Program"
            >
            <FontAwesomeIcon
            icon={isBookmarked ? solidBookmark : regularBookmark}
            className={isBookmarked ? "text-yellow-400" : "text-gray-400"}
            />
        </button>

            {/* Program Name */}
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">{programName}</h2>
            </div>

            {/* Display Current Rating */}
            <div className="current-rating mb-4">
                <h3 className="text-lg font-medium">Rating: {averageRating.toFixed(1)} / 5</h3>
                <p className="text-sm text-gray-400">{totalRatings} {totalRatings === 1 ? "vote" : "votes"}</p>
            </div>

            {/* List of Exercises */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exercises.map((exercise, index) => (
                    <Exercise
                        key={index}
                        exerciseName={exercise.name}
                        sets={exercise.sets}
                        reps={exercise.reps}
                        instruction={exercise.instruction}
                        equipment={exercise.equipment}
                        difficulty={exercise.difficulty}
                    />
                ))}
            </div>

            {/* Star Rating */}
            {showRating && (
                <div className="rating mt-4">
                    <h3 className="text-xl font-semibold mb-2">Rate this program:</h3>
                    <div className="stars flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`text-3xl cursor-pointer ${
                                    star <= (hoveredRating || rating)
                                        ? "text-yellow-400"
                                        : "text-gray-400"
                                }`}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition-all duration-300"
                        onClick={handleRatingSubmit}
                        disabled={rating === 0}
                    >
                        Submit Rating
                    </button>
                    {message && <p className="mt-2 text-green-400">{message}</p>}
                </div>
            )}

            {/* Delete Button (if the program is owned by the user) */}
            {isOwn && (
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                        onClick={onDelete}
                    >
                        Remove Program
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExerciseProgram;


import React, { useState, useContext } from "react";
import Exercise from "./Exercise";
import axios from "axios";
import "../css/index.css";
import { Context } from "../globalContext/globalContext.js";

const ExerciseProgram = ({ programName, exercises, onDelete, isOwn, programId, currentRating, ratingCount, showRating }) => {
    const [rating, setRating] = useState(0); // User's selected rating
    const [hoveredRating, setHoveredRating] = useState(0); // Highlighted stars on hover
    const [message, setMessage] = useState(null); // Feedback message after submission
    const [averageRating, setAverageRating] = useState(currentRating); // State for average rating
    const [totalRatings, setTotalRatings] = useState(ratingCount); // State for total ratings
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;

    const handleRatingSubmit = async () => {
        try {
            const response = await axios.post(baseURL + "/rate-workout/", {
                workout_id: programId,
                rating: rating,
            });

            if (response.status === 200) {
                setMessage("Rating submitted successfully!");

                // Update average rating and rating count immediately
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
        <div className="w-full bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-6 text-lightText flex flex-col">
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
                        disabled={rating === 0} // Disable the button if no rating is selected
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

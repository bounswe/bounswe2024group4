import React, { useContext, useState, useEffect } from "react";
import Food from "./Food";
import "../css/index.css";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

const Meal = ({ mealId, mealName, foods, onDelete, isOwn, currentRating, ratingCount, showRating }) => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: "Token " + token,
    },
  };

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [averageRating, setAverageRating] = useState(currentRating);
  const [totalRatings, setTotalRatings] = useState(ratingCount);
  const [message, setMessage] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false); // Bookmark state
  const [username, setUsername] = useState(""); // Username state

  // Fetch username and bookmark status
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);

      // Fetch all bookmarked meals
      const fetchBookmarkedMeals = async () => {
        try {
          const response = await axios.get(`${baseURL}/get_bookmarked_meals/`, config);

          if (response.status === 200) {
            // Check if the current meal is bookmarked
            const bookmarkedMealIds = response.data.meals.map((meal) => meal.meal_id);
            setIsBookmarked(bookmarkedMealIds.includes(mealId));
          }
        } catch (error) {
          console.error("Error fetching bookmarked meals:", error);
        }
      };

      fetchBookmarkedMeals();
    } else {
      console.error("Username not found in localStorage.");
    }
  }, [baseURL, mealId]);

  // Toggle Bookmark Function
  const toggleBookmarkMeal = async () => {
    if (!username) {
      setMessage("Username is required to bookmark a meal.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/toggle_bookmark_meal/`,
        {
          meal_id: mealId,
        },
        config
      );

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
      const response = await axios.post(
        `${baseURL}/rate_meal/`,
        {
          meal_id: mealId,
          rating: rating,
        },
        config
      );

      if (response.status === 200) {
        setMessage("Rating submitted successfully!");
        const newTotalRatings = totalRatings + 1;
        const newAverageRating = (averageRating * totalRatings + rating) / newTotalRatings;

        setTotalRatings(newTotalRatings);
        setAverageRating(newAverageRating);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setMessage("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="meal relative bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-6 text-lightText flex flex-col">
      {/* Bookmark Button */}
      <button
        className="absolute top-4 right-4 text-2xl hover:text-yellow-400 transition-all duration-300"
        onClick={toggleBookmarkMeal}
        aria-label="Bookmark Meal"
      >
        <FontAwesomeIcon
          icon={isBookmarked ? solidBookmark : regularBookmark}
          className={isBookmarked ? "text-yellow-400" : "text-gray-400"}
        />
      </button>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{mealName}</h2>
      </div>

      {/* Display Current Rating */}
      <div className="current-rating mb-4">
        <h3 className="text-lg font-medium">Rating: {averageRating.toFixed(1)} / 5</h3>
        <p className="text-sm text-gray-400">
          {totalRatings} {totalRatings === 1 ? "vote" : "votes"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {foods.map((food, index) => (
          <Food
            key={index}
            foodName={food.name || food.food_name}
            calories={food.energ_kcal}
            protein={food.protein}
            carbs={food.carbo}
            fat={food.fat}
            ingredients={food.ingredients}
            imageUrl={baseURL + food.image_url}
            recipeUrl={food.recipe_url}
            ca={food.ca}
            cholesterol={food.cholesterol}
            fiber={food.fiber}
            k={food.k}
            na={food.na}
            vitARae={food.vit_a_rae}
            vitB6={food.vit_b6}
            vitB12={food.vit_b12}
            vitC={food.vit_c}
            vitD={food.vit_d}
            vitK={food.vit_k}
          />
        ))}
      </div>

      {/* Star Rating */}
      {showRating && (
        <div className="rating mt-4">
          <h3 className="text-xl font-semibold mb-2">Rate this meal:</h3>
          <div className="stars flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-3xl cursor-pointer ${
                  star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-400"
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
            Remove Meal
          </button>
        </div>
      )}
    </div>
  );
};

export default Meal;


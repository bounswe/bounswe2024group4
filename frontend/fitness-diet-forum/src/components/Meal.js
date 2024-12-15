import React, { useContext, useState } from 'react';
import Food from './Food';
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";

const Meal = ({ mealId, mealName, foods, onDelete, isOwn, currentRating, ratingCount, showRating }) => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const token = localStorage.getItem("token");
  const config = {
      headers: {
          'Authorization': 'Token ' + token
      },
  }

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [averageRating, setAverageRating] = useState(currentRating);
  const [totalRatings, setTotalRatings] = useState(ratingCount);
  const [message, setMessage] = useState(null);

  const handleRatingSubmit = async () => {
    try {
        const response = await axios.post(baseURL + "/rate_meal/", {
            meal_id: mealId,
            rating: rating,
        }, config);

        if (response.status === 200) {
            setMessage("Rating submitted successfully!");
            console.log('totalRatings', totalRatings);
            const newTotalRatings = totalRatings + 1;
            const newAverageRating =
                (averageRating * totalRatings + rating) / newTotalRatings;
            console.log('newTotal', newTotalRatings);
            console.log('average', newAverageRating);
            setTotalRatings(newTotalRatings);
            setAverageRating(newAverageRating);
        }
    } catch (error) {
        console.error("Error submitting rating:", error);
        setMessage("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="meal bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-6 text-lightText flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{mealName}</h2>
      </div>

      {/* Display Current Rating */}
      <div className="current-rating mb-4">
        <h3 className="text-lg font-medium">Rating: {averageRating.toFixed(1)} / 5</h3>
        <p className="text-sm text-gray-400">{totalRatings} {totalRatings === 1 ? "vote" : "votes"}</p>
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
                Remove Meal
            </button>
        </div>
      )}
    </div>
  );
};

export default Meal;

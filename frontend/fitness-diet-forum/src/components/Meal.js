import React from 'react';
import Food from './Food';
import '../css/index.css';

const Meal = ({ mealName, foods, onDelete, isOwn }) => {
  return (
    <div className="meal bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-6 text-lightText flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{mealName}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {foods.map((food, index) => (
          <Food
            key={index}
            foodName={food.foodName}
            calories={food.calories}
            protein={food.protein}
            carbs={food.carbs}
            fat={food.fat}
            ingredients={food.ingredients}
            ingredientAmounts={food.ingredientAmounts}
            imageUrl={food.imageUrl}
            recipeUrl={food.recipeUrl}
          />
        ))}
      </div>

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

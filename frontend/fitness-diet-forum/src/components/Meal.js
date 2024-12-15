import React, { useContext } from 'react';
import Food from './Food';
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";

const Meal = ({ mealName, foods, onDelete, isOwn }) => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  return (
    <div className="meal bg-gray-800 border border-gray-600 shadow-lg rounded-lg p-6 text-lightText flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{mealName}</h2>
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

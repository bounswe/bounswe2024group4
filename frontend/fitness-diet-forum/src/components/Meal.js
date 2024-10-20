import React from 'react';
import Food from './Food';
import '../css/index.css';

const Meal = ({ mealName, foods }) => {
  return (
    <div className="meal darkBackground border border-gray-500 shadow-lg rounded-lg p-6 text-lightText">
      <h2 className="text-2xl font-semibold mb-4">{mealName}</h2>
      <div className="grid gap-4">
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
    </div>
  );
};

export default Meal;

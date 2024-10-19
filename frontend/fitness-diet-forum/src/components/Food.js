import React, { useState } from 'react';
import '../css/index.css'; // Ensure correct CSS path

// Utility function to capitalize the first letter of each word
const capitalizeWords = (string) => {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
};

const Food = ({ mealName, calories, protein, carbs, fat, ingredients, ingredientAmounts, imageUrl, recipeUrl }) => {
  const [activeTab, setActiveTab] = useState('nutrients'); // State for tab switching

  return (
    <div className="w-full max-w-xl mx-auto relative">  {/* Increased width from max-w-lg to max-w-xl */}
      {/* Reduce margin between tabs and div */}
      <div className="flex justify-end space-x-4 pb-2">
        <button
          onClick={() => setActiveTab('nutrients')}
          className={`text-lg font-semibold pb-2 transition-colors duration-300 ${
            activeTab === 'nutrients' ? 'text-white border-b-2 border-white' : 'text-gray-300'
          }`}
        >
          Nutrients
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`text-lg font-semibold pb-2 transition-colors duration-300 ${
            activeTab === 'ingredients' ? 'text-white border-b-2 border-white' : 'text-gray-300'
          }`}
        >
          Ingredients
        </button>
      </div>

      {/* Main Content Container */}
      <div className="bg-purple-600 p-6 rounded-lg text-white shadow-lg transition-all duration-500 ease-in-out w-full">

        {/* Meal Image, Name, and Calories */}
        <div className="flex items-start mb-4">
          <img
            src={imageUrl}
            alt={mealName}
            className="w-32 h-32 object-cover rounded-lg border-4 border-white"
          />
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">{mealName}</h1>
            <span className="text-xl font-normal">{calories} cal</span>  {/* Calories in smaller font */}
          </div>
        </div>

        {/* Content Div */}
        <div className="mt-2">
          {activeTab === 'nutrients' ? (
            <div className="nutrients transition-opacity duration-500 ease-in-out opacity-100">
              <div className="flex justify-between text-lg">
                <span>Protein</span>
                <span className="font-bold">{protein} g</span>
              </div>
              <div className="flex justify-between text-lg mt-2">
                <span>Carbs</span>
                <span className="font-bold">{carbs} g</span>
              </div>
              <div className="flex justify-between text-lg mt-2">
                <span>Fat</span>
                <span className="font-bold">{fat} g</span>
              </div>
            </div>
          ) : (
            <div className="ingredients transition-opacity duration-500 ease-in-out opacity-100">
              <ul className="mt-4 space-y-2 list-none">  {/* Removed unnecessary margin */}
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between text-lg w-full">
                    <span className="break-words">{capitalizeWords(ingredient)}</span> {/* Capitalized each word */}
                    <span className="ml-auto">{ingredientAmounts[index]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recipe Button - Only visible in Ingredients tab */}
        {activeTab === 'ingredients' && (
          <div className="mt-6">
            <a href={recipeUrl} target="_blank" rel="noopener noreferrer">
              <button className="text-white border-2 border-white hover:bg-gray-700 hover:text-gray-300 font-semibold py-2 px-6 rounded-lg transition-all duration-300">
                View Recipe
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Food;

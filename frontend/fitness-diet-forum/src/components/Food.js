import React, { useState } from 'react';
import '../index.css';

const Food = ({ mealName, calories, protein, carbs, fat, ingredients, ingredientAmounts, imageUrl }) => {
  const [activeTab, setActiveTab] = useState('nutrients'); // State for tab switching

  return (
    <div className="w-full max-w-lg mx-auto">  {/* Ensure all divs have the same width */}
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
        
        {/* Meal Image and Name with Calories underneath */}
        <div className="flex items-center mb-4">
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
        <div className="mt-2">  {/* Reduced margin to bring the content closer */}
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
            <div className="ingredients transition-opacity duration-500 ease-in-out opacity-100 break-words">
              <ul className="ml-6 mt-4 space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center text-lg break-words w-full">
                    <span className="break-words">{ingredient}</span>
                    <span className="ml-auto">{ingredientAmounts[index]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Food;

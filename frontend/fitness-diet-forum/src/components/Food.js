import React, { useState } from 'react';
import '../index.css';

const Food = ({ mealName, calories, protein, carbs, fat, ingredients, imageUrl }) => {
  const [activeTab, setActiveTab] = useState('nutrients'); // State for tab switching

  return (
    <div className="bg-purple-500 p-6 rounded-lg text-white max-w-lg mx-auto shadow-lg transition-all duration-500 ease-in-out">
      <div className="flex items-center justify-between">
        {/* Meal Image and Name */}
        <div className="flex items-center space-x-4">
          <img
            src={imageUrl}
            alt={mealName}
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <span className="text-2xl font-semibold">{mealName}</span>
        </div>
        {/* Calories */}
        <span className="text-2xl font-bold">{calories} cal</span>
      </div>

      {/* Tab Section */}
      <div className="mt-6">
        <div className="flex justify-start space-x-4 border-b-2 border-gray-300 pb-2">
          <button
            onClick={() => setActiveTab('nutrients')}
            className={`text-lg font-semibold ${
              activeTab === 'nutrients' ? 'text-white' : 'text-gray-300'
            }`}
          >
            Nutrients
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`text-lg font-semibold ${
              activeTab === 'ingredients' ? 'text-white' : 'text-gray-300'
            }`}
          >
            Ingredients
          </button>
        </div>

        {/* Conditional Rendering with Smooth Transition */}
        <div className="mt-4 overflow-hidden transition-all duration-500 ease-in-out">
          {activeTab === 'nutrients' ? (
            <div className="nutrients transition-opacity opacity-100">
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
            <div className="ingredients transition-opacity opacity-100">
              <ul className="list-disc ml-6">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-lg">{ingredient}</li>
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

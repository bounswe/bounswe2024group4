import React, { useState } from 'react';
import '../css/index.css'; // Ensure correct CSS path

const Food = ({
  foodName, 
  calories, 
  protein, 
  carbs, 
  fat, 
  imageUrl,
  ingredients,
  recipeUrl,
  ca,
  cholesterol,
  fiber,
  k,
  na,
  vitARae,
  vitB6,
  vitB12,
  vitC,
  vitD,
  vitK
}) => {
  const [activeTab, setActiveTab] = useState('nutrients'); // State for tab switching
  const [visibleSection, setVisibleSection] = useState(null); // State to track which section is visible

  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? null : section); // Toggle visibility
  };

  return (
    <div className="w-full max-w-xl mx-auto relative"> 
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

      <div className="bg-primary p-6 rounded-lg text-lightText shadow-lg transition-all duration-500 ease-in-out w-full">

        <div className="flex items-start mb-4">
          <img
            src={imageUrl}
            alt={foodName}
            className="w-32 h-32 object-cover rounded-lg border-4 border-lightText"
          />
          <div className="ml-4">
            <h1 className="text-3xl font-semibold">{foodName}</h1>
            <span className="text-xl font-normal">{calories}</span>
          </div>
        </div>

        <div className="mt-2">
          {activeTab === 'nutrients' && (
            <div className="nutrients transition-opacity duration-500 ease-in-out opacity-100">
              {/* Macro Nutrients */}
              <div>
                <h3
                  onClick={() => toggleSection('macros')}
                  className="text-lg font-semibold cursor-pointer mt-4"
                >
                  Macros
                </h3>
                {visibleSection === 'macros' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-lg">
                      <span>Protein</span>
                      <span className="font-bold">{protein || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Carbs</span>
                      <span className="font-bold">{carbs || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Fat</span>
                      <span className="font-bold">{fat || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Fiber</span>
                      <span className="font-bold">{fiber || '-'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Micro Nutrients */}
              <div>
                <h3
                  onClick={() => toggleSection('micros')}
                  className="text-lg font-semibold cursor-pointer mt-4"
                >
                  Micro Nutrients
                </h3>
                {visibleSection === 'micros' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-lg">
                      <span>Cholesterol</span>
                      <span className="font-bold">{cholesterol || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Potassium</span>
                      <span className="font-bold">{k || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Sodium</span>
                      <span className="font-bold">{na || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Calcium</span>
                      <span className="font-bold">{ca || '-'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Vitamins */}
              <div>
                <h3
                  onClick={() => toggleSection('vitamins')}
                  className="text-lg font-semibold cursor-pointer mt-4"
                >
                  Vitamins
                </h3>
                {visibleSection === 'vitamins' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-lg">
                      <span>Vitamin A</span>
                      <span className="font-bold">{vitARae || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Vitamin B6</span>
                      <span className="font-bold">{vitB6 || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Vitamin B12</span>
                      <span className="font-bold">{vitB12 || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Vitamin C</span>
                      <span className="font-bold">{vitC || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Vitamin D</span>
                      <span className="font-bold">{vitD || '-'}</span>
                    </div>
                    <div className="flex justify-between text-lg mt-2">
                      <span>Vitamin K</span>
                      <span className="font-bold">{vitK || '-'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="ingredients transition-opacity duration-500 ease-in-out opacity-100">
              <ul className="mt-4 space-y-2 list-none">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between text-lg w-full">
                    <span className="break-words">{ingredient.name}</span>
                    <span className="ml-auto">{ingredient.amount} gr</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {activeTab === 'ingredients' && (
          <div className="mt-6">
            <a href={recipeUrl} target="_blank" rel="noopener noreferrer">
              <button className="text-lightText border-2 border-lightText hover:bg-gray-700 hover:text-gray-300 font-semibold py-2 px-6 rounded-lg transition-all duration-300">
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

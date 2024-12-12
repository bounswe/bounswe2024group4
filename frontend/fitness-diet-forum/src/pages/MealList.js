import React, { useState, useContext } from 'react';
import axios from 'axios';
import Meal from '../components/Meal';
import Food from '../components/Food';
import { Context } from "../globalContext/globalContext.js";

const MealList = () => {
  const [meals, setMeals] = useState([]);  

  const [newMeal, setNewMeal] = useState({ mealName: '', foods: [] });
  const [newFood, setNewFood] = useState({ foodName: '', calories: '', protein: '', carbs: '', fat: '', ingredients: [], ingredientAmounts: [], imageUrl: '', recipeUrl: '' });
  const [ingredientName, setIngredientName] = useState(''); // Track ingredient name
  const [ingredientAmount, setIngredientAmount] = useState(''); // Track ingredient amount
  const [mealCreated, setMealCreated] = useState(false); // Track whether the meal is created
  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [foodFound, setFoodFound] = useState(true);

  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      'Authorization': 'Token ' + token
    }
  }

  const deleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleMealInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({ ...prev, [name]: value }));
  };

  const handleFoodInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle adding an ingredient
  const addIngredient = () => {
    setNewFood(prevFood => ({
      ...prevFood,
      ingredients: [...prevFood.ingredients, ingredientName],
      ingredientAmounts: [...prevFood.ingredientAmounts, ingredientAmount]
    }));
    // Reset ingredient fields
    setIngredientName('');
    setIngredientAmount('');
  };

  // Function to handle meal creation
  const createMeal = () => {
    setMealCreated(true);

    // Initialize the newMeal with the meal name and an empty foods array
    setNewMeal({
      mealName: newMeal.mealName,
      foods: [],
      id: meals.length + 1,
    });
  };

  // Function to handle food addition
  const addFoodToMeal = () => {
    const food = {
      ...newFood,
    };

    // Append the food to the existing foods array
    setNewMeal(prevMeal => ({
      ...prevMeal,
      foods: [...prevMeal.foods, food],
    }));

    // Reset the newFood form
    setNewFood({ foodName: '', calories: '', protein: '', carbs: '', fat: '', ingredients: [], ingredientAmounts: [], imageUrl: '', recipeUrl: '' });

    // Clear search term and result
    setSearchTerm(''); // Clear search input
    setFoodFound(true); // Reset search result
  };

  // Function to finalize and add the meal to the list
  const handleCreateMeal = () => {
    const newMealData = {
      ...newMeal,
      id: meals.length + 1,
    };
    setMeals(prev => [...prev, newMealData]);
    setNewMeal({ mealName: '', foods: [] });
    setMealCreated(false); // Reset the meal creation process
    setShowForm(false); // Hide the form after creation
  };

  // Function to handle food search
  const searchFood = async () => {
    //const response = await axios.post(`/${baseURL}/create_food_all/`, {food_name: searchTerm}, config);
    //setFoodFound(response.data.found);
    //setNewFood(response.data.food);
    setFoodFound(true);
  };

  return (
    <div className="meal-list p-8 bg-darkBackground min-h-screen">
      <h1 className="text-4xl font-bold text-lightText mb-10 tracking-wider">Meals</h1>
      <div className="grid gap-10">
        {meals.map(meal => (
          <Meal 
            key={meal.id}
            mealName={meal.mealName} 
            foods={meal.foods}
            onDelete={() => deleteMeal(meal.id)}
          />
        ))}
      </div>

      {!showForm && (
        <button 
          className="mt-10 bg-primary text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          onClick={() => setShowForm(true)}
        >
          Create a Meal
        </button>
      )}

      {showForm && (
        <div className="mt-10 p-8 bg-gray-800 rounded-lg shadow-lg space-y-8">
          {!mealCreated ? (
            <>
              {/* Meal Name Input */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white tracking-wide">Create a New Meal</h3>
                <label className="block text-lg font-medium text-lightText">Meal Name</label>
                <input 
                  type="text" 
                  name="mealName" 
                  value={newMeal.mealName} 
                  onChange={handleMealInputChange} 
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter meal name"
                />
                <button 
                  className="mt-6 bg-green-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300"
                  onClick={createMeal}
                >
                  Create Meal
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Display Progress of Added Foods ABOVE the form */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Foods Added to {newMeal.mealName || 'Meal'}</h3>
                {newMeal.foods.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {newMeal.foods.map((food, index) => (
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
                ) : (
                  <p className="text-lightText">No foods added yet.</p>
                )}
              </div>

              {/* Food Search Input */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white tracking-wide">Search for Food</h3>
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter food name"
                />
                <button
                  className="w-auto min-w-[200px] py-2 px-8 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                  onClick={searchFood}
                >
                  Search
                </button>

                {/* Display message if food not found */}
                (
                  <>
                  { !foodFound && 
                    <p className="text-red-500 mt-4">Food not found. Please enter the food information below.</p>
                  }
                    {/* Food Item Inputs */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-white tracking-wide">Add Food Item</h4>
                      <input 
                        type="text" 
                        name="foodName" 
                        value={newFood.foodName} 
                        onChange={handleFoodInputChange} 
                        disabled={foodFound}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                        placeholder="Food name"
                      />
                      <input 
                        type="number" 
                        name="calories" 
                        value={newFood.calories} 
                        onChange={handleFoodInputChange}
                        disabled={foodFound}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                        placeholder="Calories"
                      />
                      <div className="flex space-x-4">
                        <input 
                          type="number" 
                          name="protein" 
                          value={newFood.protein} 
                          onChange={handleFoodInputChange} 
                          disabled={foodFound} 
                          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                          placeholder="Protein (g)"
                        />
                        <input 
                          type="number" 
                          name="carbs" 
                          value={newFood.carbs}
                          disabled={foodFound} 
                          onChange={handleFoodInputChange} 
                          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                          placeholder="Carbs (g)"
                        />
                        <input 
                          type="number" 
                          name="fat" 
                          value={newFood.fat}
                          disabled={foodFound} 
                          onChange={handleFoodInputChange} 
                          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                          placeholder="Fat (g)"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-white tracking-wide">Add Ingredient</h4>
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={ingredientName}
                          disabled={foodFound} 
                          onChange={(e) => setIngredientName(e.target.value)}
                          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent"
                          placeholder="Ingredient name"
                        />
                        <input
                          type="text"
                          value={ingredientAmount}
                          disabled={foodFound} 
                          onChange={(e) => setIngredientAmount(e.target.value)}
                          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent"
                          placeholder="Amount"
                        />
                        <button
                          className="w-auto min-w-[200px] py-2 px-8 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                          onClick={addIngredient}
                          disabled={foodFound}
                        >
                          Add Ingredient
                        </button>
                      </div>

                      {/* Show added ingredients */}
                      {newFood.ingredients.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-white tracking-wide">Ingredients Added</h4>
                          <ul className="list-disc list-inside text-lightText">
                            {newFood.ingredients.map((ingredient, index) => (
                              <li key={index}>
                                {ingredient} - {newFood.ingredientAmounts[index]}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Buttons in a Row */}
                      <div className="flex justify-between mt-6 space-x-4">
                        <button 
                          className="w-full py-3 px-6 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-300"
                          onClick={addFoodToMeal}
                        >
                          Add Food to Meal
                        </button>

                        <button 
                          className="w-full py-3 px-6 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-800 transition-colors duration-300"
                          onClick={handleCreateMeal}
                        >
                          Finalize and Save Meal
                        </button>

                        <button 
                          className="w-full py-3 px-6 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                )
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MealList;

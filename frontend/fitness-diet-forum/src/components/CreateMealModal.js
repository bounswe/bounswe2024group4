import React, { useState, useEffect, useContext } from "react";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";
import Food from './Food';
import NutrientSection from "./NutrientSection.js";


const CreateMealModal = (userMeals, onClose) => {
    const [meals, setMeals] = useState(userMeals); 
    const [newMeal, setNewMeal] = useState({ mealName: '', foods: [] });
    const [mealCreated, setMealCreated] = useState(false); // Track whether the meal is created
    const [newFood, setNewFood] = useState(null);
    const [ingredientName, setIngredientName] = useState(''); // Track ingredient name
    const [ingredientAmount, setIngredientAmount] = useState(''); // Track ingredient amount
    const [searchTerm, setSearchTerm] = useState('');
    const [foodFound, setFoodFound] = useState(true);
    const [foods, setFoods] = useState([]);
    const [suggestedFoods, setSuggestedFoods] = useState([]);

    const [error, setError] = useState(null);
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        'Authorization': 'Token ' + token
      }
    }

    const [ca, setCa] = useState('');
    const [carbo, setCarbo] = useState('');
    const [cholesterol, setCholesterol] = useState('');
    const [energKcal, setEnergKcal] = useState('');
    const [fat, setFat] = useState('');
    const [fatSaturated, setFatSaturated] = useState('');
    const [fatTrans, setFatTrans] = useState('');
    const [fiber, setFiber] = useState('');
    const [k, setK] = useState('');
    const [na, setNa] = useState('');
    const [protein, setProtein] = useState('');
    const [recipeUrl, setRecipeUrl] = useState('');
    const [sugar, setSugar] = useState('');
    const [vitARae, setVitARae] = useState('');
    const [vitB6, setVitB6] = useState('');
    const [vitB12, setVitB12] = useState('');
    const [vitC, setVitC] = useState('');
    const [vitD, setVitD] = useState('');
    const [vitK, setVitK] = useState('');

    useEffect(() => {
        const fetchFoods = async () => {
          try {
              const response = await axios.get(baseURL + "/get_foodname_options/", config);
              setFoods(response.data.food_list);
          } catch (err) {
              setError("Something went wrong. Please try again later.");
          }
        };
        fetchFoods();
      }, [baseURL]);

    const handleMealInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeal(prev => ({ ...prev, [name]: value }));
    };

    // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
        case 'ca':
            setCa(value);
            break;
        case 'carbo':
            setCarbo(value);
            break;
        case 'cholesterol':
            setCholesterol(value);
            break;
        case 'energKcal':
            setEnergKcal(value);
            break;
        case 'fat':
            setFat(value);
            break;
        case 'fatSaturated':
            setFatSaturated(value);
            break;
        case 'fatTrans':
            setFatTrans(value);
            break;
        case 'fiber':
            setFiber(value);
            break;
        case 'k':
            setK(value);
            break;
        case 'na':
            setNa(value);
            break;
        case 'protein':
            setProtein(value);
            break;
        case 'recipeUrl':
            setRecipeUrl(value);
            break;
        case 'sugar':
            setSugar(value);
            break;
        case 'vitARae':
            setVitARae(value);
            break;
        case 'vitB6':
            setVitB6(value);
            break;
        case 'vitB12':
            setVitB12(value);
            break;
        case 'vitC':
            setVitC(value);
            break;
        case 'vitD':
            setVitD(value);
            break;
        case 'vitK':
            setVitK(value);
            break;
        default:
            break;
        }
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
        setNewFood(null);
        // Clear search term and result
        setSearchTerm(''); // Clear search input
        setFoodFound(true); // Reset search result
    };
    // Function to finalize and add the meal to the list
    const handleCreateMeal = () => {
        const newMealData = {
            ...newMeal,
        };
        setMeals(prev => [...prev, newMealData]);
        setNewMeal({ mealName: '', foods: [] });
        setMealCreated(false); // Reset the meal creation process
//        onClose;
    };

    const handleFoodNameInputChange = (e) => {
        const input = e.target.value;
        setSearchTerm(input);

        if (input) {
        // Filter foods for names starting with the input (case insensitive)
        const suggestions = foods.filter((food) =>
            food.name.toLowerCase().startsWith(input.toLowerCase())
        );
            setSuggestedFoods(suggestions);
        } else {
            setSuggestedFoods([]);
        }
    };

    const handleSuggestionClick = async (food) => {
        setSearchTerm(food.name); // Set input value to the selected suggestion
        const foodResponse = await axios.get(baseURL + "/get_food_by_id/?food_id="+food.food_id, config);
        console.log("RESPONSE:", foodResponse);
        setNewFood(foodResponse.data);
        setFoodFound(true);
        setSuggestedFoods([]);  // Clear the suggestions
    };

    const searchFood = () => {
        // Perform the search action with the searchTerm
        const selectedFood = foods.find(
            (food) => food.name.toLowerCase() === searchTerm.toLowerCase()
        );
        if (selectedFood) {
            console.log("Food found:", selectedFood);
            setFoodFound(true);
            setNewFood(selectedFood);
            setSuggestedFoods([]);
        } else {
            console.log("No food found with the name:", searchTerm);
            setFoodFound(false);
            setNewFood(null);
            setSuggestedFoods([]);
        }
    };

    const createMeal = () => {
        setMealCreated(true);

        // Initialize the newMeal with the meal name and an empty foods array
        setNewMeal({
            mealName: newMeal.mealName,
            foods: [],
        });
    };

    const inputStyle = {
        width: '200px',
        padding: '10px',
        fontSize: '14px',
        border: '1px solid border-gray-600',
        borderRadius: '5px',
        margin: '5px',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: '#374151',
        cursor: newFood ? 'not-allowed' : 'text',
        color: 'white'
    };

    const labelStyle = {
        width: '200px',
        marginBottom: '5px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#FFFF'
    };

    return (
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
                  onChange={(e) => handleFoodNameInputChange(e)} 
                  className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter food name"
                />
                {/* Suggestions Dropdown */}
                {suggestedFoods.length > 0 && (
                  <ul className="mt-2 bg-gray-800 rounded-lg text-white p-2 max-h-40 overflow-y-auto">
                    {suggestedFoods.map((food) => (
                      <li
                        key={food.food_id}
                        className="p-2 cursor-pointer hover:bg-gray-600 rounded"
                        onClick={() => handleSuggestionClick(food)}
                      >
                        {food.name}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="w-auto min-w-[200px] py-2 px-8 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                  onClick={searchFood}
                >
                  Search
                </button>

                {/* Display message if food not found */}
                  <>
                  { !foodFound && 
                    <p className="text-red-500 mt-4">Food not found. Please enter the food information below.</p>
                  }
                  {/* Show Input Fields if newFood is null */}
                {newFood === null ? (
                    <div>
                    <h4 className="text-lg font-semibold text-white tracking-wide">Add Ingredient</h4>
                    <div className="flex items-center space-x-4">
                        <input
                        type="text"
                        value={ingredientName}
                        disabled={newFood ? true : false}
                        onChange={(e) => setIngredientName(e.target.value)}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent"
                        placeholder="Ingredient name"
                        />
                        <input
                        type="text"
                        value={ingredientAmount}
                        disabled={newFood ? true : false}
                        onChange={(e) => setIngredientAmount(e.target.value)}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent"
                        placeholder="Amount"
                        />
                        <button
                        className="w-auto min-w-[200px] py-2 px-8 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                        onClick={addIngredient}
                        disabled={newFood ? true : false}
                        >
                        Add Ingredient
                        </button>
                    </div>
                    </div>
                ) : (
                    // Show the list of ingredients if newFood is not null
                    <div className="mt-8">
                    <h4 className="text-lg font-semibold text-white tracking-wide mb-4">Ingredients List</h4>
                    <div className="space-y-4">
                        {newFood.ingredients && newFood.ingredients.length > 0 ? (
                        newFood.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-lg w-1/3">
                            <div className="flex flex-col">
                                {/* Display quantity, unit, and ingredient name */}
                                <span className="text-white font-semibold">{ingredient.slice(2).join(" ")}</span>
                                <span className="text-gray-400">
                                {ingredient[0]} {ingredient[1]}
                                </span>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p className="text-gray-400">No ingredients added yet.</p>
                        )}
                    </div>
                    </div>
                )}

                {/* Nutrient Sections */}
                <h4 className="text-lg font-semibold text-white tracking-wide mb-4">Nutrients</h4>
                    <div className="flex justify-between gap-8 flex-row">
                    <div className="flex flex-col gap-8 w-1/3">
                        <NutrientSection
                            title="Recipe"
                            nutrients={[
                                { label: "", name: "recipeURL", value: newFood?.recipe_url || recipeUrl },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                        />
                        <NutrientSection
                            title="Calories"
                            nutrients={[
                                { label: "", name: "calories", value: newFood?.energ_kcal || energKcal },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                        />
                    </div>
                        <NutrientSection
                            title="Macronutrients"
                            nutrients={[
                                { label: "Carbohydrates", name: "carbo", value: newFood?.carbo || carbo },
                                { label: "Fat", name: "fat", value: newFood?.fat || fat },
                                { label: "Saturated Fat", name: "fatSaturated", value: newFood?.fat_saturated || fatSaturated },
                                { label: "Trans Fat", name: "fatTrans", value: newFood?.fat_trans || fatTrans },
                                { label: "Protein", name: "protein", value: newFood?.protein || protein },
                                { label: "Sugar", name: "sugar", value: newFood?.sugar || sugar },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                        />

                        <NutrientSection
                            title="Micronutrients"
                            nutrients={[
                                { label: "Cholesterol", name: "cholesterol", value: newFood?.cholesterol || cholesterol },
                                { label: "Fiber", name: "fiber", value: newFood?.fiber || fiber },
                                { label: "Potassium", name: "k", value: newFood?.k || k },
                                { label: "Sodium", name: "na", value: newFood?.na || na },
                                { label: "Calcium", name: "ca", value: newFood?.ca || ca },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                        />

                        <NutrientSection
                            title="Vitamins"
                            nutrients={[
                                { label: "Vitamin A", name: "vitARae", value: newFood?.vit_a_rae || vitARae },
                                { label: "Vitamin B6", name: "vitB6", value: newFood?.vit_b6 || vitB6 },
                                { label: "Vitamin B12", name: "vitB12", value: newFood?.vit_b12 || vitB12 },
                                { label: "Vitamin C", name: "vitC", value: newFood?.vit_c || vitC },
                                { label: "Vitamin D", name: "vitD", value: newFood?.vit_d || vitD },
                                { label: "Vitamin K", name: "vitK", value: newFood?.vit_k || vitK },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                        />
                    </div>
                  </>
                
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
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    </div>
              </div>
            </>
          )}
        </div>
    );
};

export default CreateMealModal;
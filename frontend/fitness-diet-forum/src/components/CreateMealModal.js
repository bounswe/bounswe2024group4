import React, { useState, useEffect, useContext } from "react";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";
import Food from './Food';
import NutrientSection from "./NutrientSection.js";
import { faHouseMedicalCircleExclamation } from "@fortawesome/free-solid-svg-icons";


const CreateMealModal = (onClose) => {
    const [newMeal, setNewMeal] = useState({ meal_name: '', foods: [] });
    const [mealCreated, setMealCreated] = useState(false); // Track whether the meal is created
    const [newFood, setNewFood] = useState(null);
    const [foodIDs, setFoodIDs] = useState([]);
    const [ingredientName, setIngredientName] = useState('');
    const [ingredientAmount, setIngredientAmount] = useState(''); 
    const [searchTerm, setSearchTerm] = useState('');
    const [foodFound, setFoodFound] = useState(true);
    const [foods, setFoods] = useState([]);
    const [suggestedFoods, setSuggestedFoods] = useState([]);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [foodPicture, setFoodPicture] = useState(null);
    const [preview, setPreview] = useState(""); 

    const [error, setError] = useState(null);
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const token = localStorage.getItem("token");
    const isSuperMember = localStorage.getItem("userType") === "super_member"
    const config = {
      headers: {
        'Authorization': 'Token ' + token
      }
    }

    const [foodName, setFoodName] = useState('');
    const [ca, setCa] = useState('');
    const [carbo, setCarbo] = useState('');
    const [cholesterol, setCholesterol] = useState('');
    const [calories, setcalories] = useState('');
    const [fat, setFat] = useState('');
    const [fiber, setFiber] = useState('');
    const [k, setK] = useState('');
    const [na, setNa] = useState('');
    const [protein, setProtein] = useState('');
    const [recipeUrl, setRecipeUrl] = useState('');
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

    const fetchNutrients = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('food_name', foodName);
        formDataToSend.append('ingredients', ingredientsList
            .map(ingredient => `${ingredient.amount} gr ${ingredient.name}`)
            .join("\n"));
        formDataToSend.append('recipe_url', recipeUrl);
        formDataToSend.append('image_url', foodPicture);

        try{
            const nutrientsResponse = await axios.post(
                baseURL + "/create_food_all/", 
                formDataToSend, 
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(nutrientsResponse);
            if(nutrientsResponse.status !== 201){       
                setNewFood(null);
                setError("Food not found");
            }else{
                setNewFood(nutrientsResponse.data);
                setError(null);
            }
        }catch{
            setError("Food not found");
            setNewFood(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFoodPicture(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

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
        case 'calories':
            setcalories(value);
            break;
        case 'fat':
            setFat(value);
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
        if(ingredientAmount && ingredientName){
            setIngredientsList([
                ...ingredientsList,
                { name: ingredientName, amount: ingredientAmount }
              ]);
        }
        console.log(ingredientsList);
        // Reset ingredient fields
        setIngredientName('');
        setIngredientAmount('');
    };

    const removeIngredient = (amount, name) => {
        if (amount && name) {
            setIngredientsList(prevList =>
                prevList.filter(ingredient => !(ingredient.name === name && ingredient.amount === amount))
            );
        }
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
        setFoodIDs(prevIDs => [...prevIDs, food.food_id]);
        
        setNewFood(null);
        setSearchTerm('');
        setFoodFound(true);
        setIngredientsList([]);
        setRecipeUrl("");
        setFoodPicture(null);
        setPreview("");
    };
    // Function to finalize and add the meal to the list
    const handleCreateMeal = async () => {
        if(!foodIDs || foodIDs.length < 1){
            setError("You should add food to meal.");
            return;
        }
        const newFoodIDs = [...foodIDs,];
        const newMealData = {
            ...newMeal,
        };
        console.log("sending:", newFoodIDs);
        try{
            const mealResponse = await axios.post(
                baseURL + "/create_meal/", 
                {
                    meal_name: newMealData.meal_name,
                    foods: newFoodIDs
                }, 
                config
            );
            if(mealResponse.status !== 201){       
                setError("Meal couldn't be created.");
            }else{
                setError(null);
            }
        }catch{
            setError("Something went wrong.");
        }
        setNewMeal({ meal_name: '', foods: [] });
        setFoodIDs([]);
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
        
        const responseData = foodResponse.data;
        responseData.food_id = food.food_id
        setNewFood(responseData);
        console.log("RESPONSE+FOOD ID:", responseData);
        function parseIngredients(ingredients) {
            if (Array.isArray(ingredients)) {
                ingredients = ingredients.flat().join("\n");
            }
            return ingredients.split("\n").map(line => {
                const parts = line.trim().split(" ");
                const amount = parts.slice(0, 2).join(" ");
                const name = parts.slice(2).join(" ");
                return {
                    name: name.trim(),
                    amount: amount.trim()
                };
            });
          }
        
        const ingList = parseIngredients(foodResponse.data.ingredients);
        setIngredientsList(ingList);
        setPreview(baseURL + foodResponse.data.image_url)
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
            setFoodName(searchTerm);
        }
    };

    const createMeal = () => {
        setMealCreated(true);
        setNewMeal({
            meal_name: newMeal.meal_name,
            foods: [],
        });
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
                  name="meal_name" 
                  value={newMeal.meal_name} 
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
                <h3 className="text-xl font-semibold text-white mb-4">Foods Added to {newMeal.meal_name || 'Meal'}</h3>
                {newMeal.foods.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {newMeal.foods.map((food, index) => (
                      <Food
                        key={index}
                        foodName={food.food_name}
                        calories={food.calories}
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
                { (!foodFound && !newFood) && 
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
                            placeholder="Amount (gr)"
                        />
                        <button
                            className="w-auto min-w-[200px] py-2 px-8 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                            onClick={addIngredient}
                            disabled={newFood ? true : false}
                        >
                        Add Ingredient
                        </button>
                    </div>
                    {/* Displaying added ingredients with the same styling as input fields */}
                    <div className="mt-4">
                    <h5 className="text-lg font-semibold text-white">Added Ingredients</h5>
                    <div className="space-y-4">
                        {ingredientsList.map((ingredient, index) => (
                        <div className="flex items-center space-x-4">
                            <div
                                key={index}
                                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText"
                            >
                                <span>{ingredient.name} ({ingredient.amount} gr)</span>
                            </div>
                                <button
                                    className="w-auto min-w-[200px] py-2 px-8 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-all duration-300"
                                    onClick={() => removeIngredient(ingredient.amount, ingredient.name)}
                                >
                                Remove Ingredient
                                </button>
                            </div>
                            ))}
                        </div>
                    </div>
                        <div>
                            <button
                                className="w-auto min-w-[200px] py-2 px-8 bg-purple-500 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300"
                                onClick={fetchNutrients}
                            >
                                Get Nutrients
                            </button>
                            {error && (
                                <p className="text-red-500 text-lg font-semibold">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>
                    
                ) : (
                    // Show the list of ingredients if newFood is not null
                    <div className="mt-8">
                    <h4 className="text-lg font-semibold text-white tracking-wide mb-4">Ingredients List</h4>
                    <div className="space-y-4">
                        {ingredientsList && ingredientsList.length > 0 ? (
                        ingredientsList.map((ingredient, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-lg w-1/3">
                            <div className="flex flex-col">
                                {/* Display quantity, unit, and ingredient name */}
                                <span className="text-white font-semibold">{ingredient.name}</span>
                                <span className="text-gray-400">
                                {ingredient.amount} gr
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
                                { label: "", name: "recipeUrl", value: newFood?.recipe_url || recipeUrl },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                            visible={true}
                            placeholder="Enter recipe URL"
                        />
                        <p className="text-white font-medium">Food Picture</p>
                        <div className="w-24 h-24 mb-4 relative">
                        
                            <img
                                className="w-24 h-24 rounded-full border border-gray-300 object-cover"
                                src={preview || "https://via.placeholder.com/150"}
                                alt="Food Picture Preview"
                            />
                            <label
                                htmlFor="fileUpload"
                                className="absolute inset-0 hover:bg-gray-200 opacity-60 rounded-full flex justify-center items-center cursor-pointer transition duration-500"
                            >
                                <img
                                    className="w-6 h-6"
                                    src="https://www.svgrepo.com/show/33565/upload.svg"
                                    alt="Upload Icon"
                                />
                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={!!newFood}
                                />
                            </label>
                        </div>
                        <NutrientSection
                            title="Calories"
                            nutrients={[
                                { label: "", name: "calories", value: newFood?.calories || calories },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                            visible={newFood || isSuperMember}
                        />
                    </div>
                        <NutrientSection
                            title="Macronutrients"
                            nutrients={[
                                { label: "Carbohydrates", name: "carbo", value: newFood?.carbo || carbo },
                                { label: "Fat", name: "fat", value: newFood?.fat || fat },
                                { label: "Protein", name: "protein", value: newFood?.protein || protein },
                                { label: "Fiber", name: "fiber", value: newFood?.fiber || fiber },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                            visible={newFood || isSuperMember}
                        />

                        <NutrientSection
                            title="Micronutrients"
                            nutrients={[
                                { label: "Cholesterol", name: "cholesterol", value: newFood?.cholesterol || cholesterol },
                                { label: "Potassium", name: "k", value: newFood?.k || k },
                                { label: "Sodium", name: "na", value: newFood?.na || na },
                                { label: "Calcium", name: "ca", value: newFood?.ca || ca },
                            ]}
                            handleInputChange={handleInputChange}
                            disabled={!!newFood}
                            visible={newFood || isSuperMember}
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
                            visible={newFood || isSuperMember}
                        />
                    </div>
                  </>
                
                {/* Buttons in a Row */}
                <div className="flex justify-between mt-6 space-x-4">
                    <button 
                        className="w-full py-3 px-6 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-300"
                        onClick={addFoodToMeal}
                        disabled={!ingredientsList}
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
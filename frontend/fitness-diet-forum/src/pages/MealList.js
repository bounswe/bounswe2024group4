import React, { useState, useEffect, useContext } from 'react';
import Meal from '../components/Meal';
import axios from 'axios';
import CreateMealModal from '../components/CreateMealModal.js';
import { Context } from "../globalContext/globalContext.js";

const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      'Authorization': 'Token ' + token
    }
  }

  useEffect(() => {
    const fetchUserMeals = async () => {
        try {
            const response = await axios.get(baseURL + `/get_meals/`, config);
            if (response.status === 200) {
                const data = response.data;
                console.log(data);
                setMeals(data.meals);
            } else {
                setError('User not found');
            }
        } catch (error) {
            setError('Something went wrong');
        }
    };

    fetchUserMeals();
  }, []);

  const deleteMeal = (mealId) => {
    setMeals(meals.filter((meal) => meal.id !== mealId));
  };

  return (
    <div className="meal-list p-8 bg-darkBackground min-h-screen">
      <h1 className="text-4xl font-bold text-lightText mb-10 tracking-wider">Meals</h1>
      {error ? (
        <div className="text-center text-red-500">
          <p className="text-xl font-medium">{error}</p>
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center text-lightText">
          <p className="text-xl font-medium">No meals available. Create a new meal to get started!</p>
        </div>
      ) : (
        <div className="grid gap-10">
          {meals.map((meal) => (
            <Meal
              key={meal.id}
              mealName={meal.mealName}
              foods={meal.foods}
              onDelete={() => deleteMeal(meal.id)}
              isOwn={true}
            />
          ))}
        </div>
      )}

      {!showForm && (
        <button
          className="mt-10 bg-primary text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          onClick={() => setShowForm(true)}
        >
          Create a Meal
        </button>
      )}

      {showForm && (
        <CreateMealModal
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MealList;

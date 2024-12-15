import React, { useState } from 'react';
import Meal from '../components/Meal';
import CreateMealModal from '../components/CreateMealModal.js';

const MealList = () => {
  const [meals, setMeals] = useState([]);  
  const [showForm, setShowForm] = useState(false);
  const deleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
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
        <CreateMealModal
          userMeals={meals}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MealList;

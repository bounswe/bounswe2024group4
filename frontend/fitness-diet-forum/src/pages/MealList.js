import React, { useState, useEffect, useContext } from 'react';
import Meal from '../components/Meal';
import axios from 'axios';
import CreateMealModal from '../components/CreateMealModal.js';
import { Context } from "../globalContext/globalContext.js";

const MealList = () => {
  const [meals, setMeals] = useState([]);
  const [bookmarkedMeals, setBookmarkedMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // Active tab: 'all' or 'bookmarked'
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: 'Token ' + token,
    },
  };
  const [changed, setChanged] = useState(false);

  // Fetch all user meals
  useEffect(() => {
    const fetchUserMeals = async () => {
      try {
        const response = await axios.get(baseURL + `/get_meals/`, config);
        if (response.status === 200) {
          setMeals(response.data.meals);
        } else {
          setError("Failed to fetch meals.");
        }
      } catch (error) {
        setError("Something went wrong.");
      }
    };

    fetchUserMeals();
  }, [changed, showForm]);

  // Fetch bookmarked meals
  useEffect(() => {
    if (activeTab === "bookmarked") {
      const fetchBookmarkedMeals = async () => {
        try {
          const response = await axios.get(baseURL + `/get_bookmarked_meals/`, config);
          if (response.status === 200) {
            const bookmarkedMealIds = response.data.map((meal) => meal.meal_id);

            // Fetch detailed meal data for each bookmarked meal
            const mealPromises = bookmarkedMealIds.map(async (id) => {
              try {
                const mealResponse = await axios.get(baseURL + `/get_meal_from_id/?meal_id=${id}`, config);
                return mealResponse.data;
              } catch (error) {
                console.error(`Failed to fetch details for meal ID ${id}:`, error);
                return null; // Skip meals that failed to fetch
              }
            });

            const detailedMeals = await Promise.all(mealPromises);
            setBookmarkedMeals(detailedMeals.filter((meal) => meal !== null));
          }
        } catch (error) {
          console.error("Error fetching bookmarked meals:", error);
          setError("Failed to fetch bookmarked meals.");
        }
      };

      fetchBookmarkedMeals();
    }
  }, [activeTab, baseURL]);

  const deleteMeal = async (mealId) => {
    try {
      const deleteResponse = await axios.delete(`${baseURL}/meals/delete/${mealId}/`, config);
      if (deleteResponse.status === 200) {
        setMeals(meals.filter((meal) => meal.meal_id !== mealId));
        setChanged(!changed);
      }
    } catch (error) {
      setError("Could not delete meal.");
    }
  };

  return (
    <div className="meal-list p-8 bg-darkBackground min-h-screen">
      <h1 className="text-4xl font-bold text-lightText mb-10 tracking-wider">Meals</h1>

      {/* Tabs */}
      <div className="tabs flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "all" ? "bg-primary text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Meals
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "bookmarked" ? "bg-primary text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("bookmarked")}
        >
          Bookmarked Meals
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "all" && (
        <>
          {!showForm && (
            <>
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
                      key={meal.meal_id}
                      mealId={meal.meal_id}
                      mealName={meal.meal_name}
                      foods={meal.foods}
                      onDelete={() => deleteMeal(meal.meal_id)}
                      isOwn={true}
                      currentRating={meal.rating}
                      ratingCount={meal.rating_count}
                      showRating={false}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!showForm && (
            <button
              className="mt-10 bg-primary text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300"
              onClick={() => setShowForm(true)}
            >
              Create a Meal
            </button>
          )}

          {showForm && <CreateMealModal onClose={() => setShowForm(false)} />}
        </>
      )}

      {activeTab === "bookmarked" && (
        <>
          {error ? (
            <div className="text-center text-red-500">
              <p className="text-xl font-medium">{error}</p>
            </div>
          ) : bookmarkedMeals.length === 0 ? (
            <div className="text-center text-lightText">
              <p className="text-xl font-medium">No bookmarked meals found.</p>
            </div>
          ) : (
            <div className="grid gap-10">
              {bookmarkedMeals.map((meal) => (
                <Meal
                  key={meal.meal_id}
                  mealId={meal.meal_id}
                  mealName={meal.meal_name}
                  foods={meal.foods}
                  onDelete={() => {}}
                  isOwn={false}
                  currentRating={meal.rating}
                  ratingCount={meal.rating_count}
                  showRating={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MealList;


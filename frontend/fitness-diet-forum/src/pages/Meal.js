import React from 'react';
import Food from '../components/Food'; // Import the Food component

const Meal = () => {
  const meals = [
    {
      mealName: 'Grilled Chicken Salad',
      calories: 400,
      protein: 40,
      carbs: 20,
      fat: 10,
      ingredients: ['Chicken breast', 'Lettuce', 'Tomatoes', 'Cucumbers', 'Olive oil'],
      imageUrl: '/grilled_chicken_salad.jpeg',
    },
    {
      mealName: 'Avocado Toast with Poached Egg',
      calories: 350,
      protein: 15,
      carbs: 30,
      fat: 20,
      ingredients: ['Avocado', 'Whole grain bread', 'Poached egg', 'Lemon', 'Salt', 'Pepper'],
      imageUrl: '/avocado_toast.jpg',
    },
    {
      mealName: 'Smoothie Bowl',
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 15,
      ingredients: ['Bananas', 'Berries', 'Greek yogurt', 'Granola', 'Honey'],
      imageUrl: '/smoothie_bowl.jpeg',
    },
    // Add more meals if needed
  ];

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">My meals</h1>
      <div className="grid gap-6">
        {meals.map((meal, index) => (
          <Food
            key={index}
            mealName={meal.mealName}
            calories={meal.calories}
            protein={meal.protein}
            carbs={meal.carbs}
            fat={meal.fat}
            ingredients={meal.ingredients}
            imageUrl={meal.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Meal;

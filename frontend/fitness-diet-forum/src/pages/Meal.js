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
      ingredientAmounts: ['200g', '2 cups', '1 cup', '1 cup', '2 tbsp'],
      imageUrl: '/grilled_chicken_salad.jpeg',
    },
    {
      mealName: 'Avocado Toast with Poached Egg',
      calories: 350,
      protein: 15,
      carbs: 30,
      fat: 20,
      ingredients: ['Avocado', 'Whole grain bread', 'Poached egg', 'Lemon', 'Salt', 'Pepper'],
      ingredientAmounts: ['1 whole', '2 slices', '1', '1/2 tsp', 'to taste', 'to taste'],
      imageUrl: '/avocado_toast.jpg',
    },
    {
      mealName: 'Smoothie Bowl',
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 15,
      ingredients: ['Bananas', 'Berries', 'Greek yogurt', 'Granola', 'Honey'],
      ingredientAmounts: ['1', '1 cup', '1/2 cup', '1/4 cup', '1 tbsp'],
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
            ingredientAmounts={meal.ingredientAmounts}  
            imageUrl={meal.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Meal;

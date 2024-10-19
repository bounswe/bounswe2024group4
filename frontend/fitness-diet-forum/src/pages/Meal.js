import React from 'react';
import Food from '../components/Food'; // Import the Food component
import '../css/index.css'; // Correct path for the CSS file

const Meal = () => {
  const meals = [
    {
      mealName: 'Grilled Chicken Salad',
      calories: 400,
      protein: 40,
      carbs: 20,
      fat: 10,
      ingredients: ['garlic cloves, peeled', 'olive oil', 'skinless, boneless chicken breasts or thighs', 'Dijon or whole grain mustard', 'red wine vinegar', 'pitted olives', '(packed) arugula (not baby)', 'flat-leaf parsley leaves', 'roasted red peppers from a jar, cut into 1/2-inch-wide strips'],
      ingredientAmounts: ['20', '1 cup', '1 pound', '2 tablespoons', '2 tablespoons', '1/4 cup', '4 cups', '1/4 cup', '3'],
      imageUrl: '/grilled_chicken_salad.jpeg',
      recipeUrl: 'https://www.bonappetit.com/recipe/grilled-chicken-salad-with-garlic-confit', // Add the recipe URL
    },
    {
      mealName: 'Avocado Toast with Poached Egg',
      calories: 350,
      protein: 15,
      carbs: 30,
      fat: 20,    
      ingredients: ['whole-grain bread', 'eggs, poached or hard-boiled (with no added fat)', 'avocado'],
      ingredientAmounts: ['2 slices', '2', '2 tbsp. (1 ounce)'],
      imageUrl: '/avocado_toast.jpg',
      recipeUrl: 'https://www.upmcmyhealthmatters.com/avocado-toast/', // Add the recipe URL
    },
    {
      mealName: 'Smoothie Bowl',
      calories: 350,
      protein: 20,
      carbs: 40,
      fat: 15,
      ingredients: ['almond milk', 'frozen banana', 'frozen mixed berries', 'nonfat Greek yogurt (optional)', 'blueberries', 'raspberries', 'granola', 'pepita seeds', 'blackberry'],
      ingredientAmounts: ['1 cup', '1/2', '1 cup', '1 tablespoon', '1/3 cup', '1/4 cup', '2 tablespoons', '1 tablespoon', '1'],
      imageUrl: '/smoothie_bowl.jpeg',
      recipeUrl: 'https://www.example.com/smoothie-bowl-recipe', // Add the recipe URL
    },
    // Add more meals if needed
  ];

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">My Meals</h1>
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
            recipeUrl={meal.recipeUrl} // Pass the recipe URL
          />
        ))}
      </div>
    </div>
  );
};

export default Meal;

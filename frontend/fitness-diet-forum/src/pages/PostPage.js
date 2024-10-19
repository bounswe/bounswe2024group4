import React from "react";
import Post from "../components/Post"; // Import your Post component

const PostPage = () => {
    // Sample user data for each post
    const users = [
        {
            id: 1,
            name: "Alice",
            surname: "Smith",
            username: "alice_smith",
            profilePic: "/woman1.jpg", // Replace with actual path
            rating: 4,
        },
        {
            id: 2,
            name: "Jane",
            surname: "Doe",
            username: "jane_doe",
            profilePic: "/woman2.jpg", // Replace with actual path
            rating: 5,
        },
        {
            id: 3,
            name: "Bob",
            surname: "Johnson",
            username: "bob_johnson",
            profilePic: "/man2.jpg", // Replace with actual path
            rating: 3,
        },
    ];

    // Sample food data
    const foodDataArray = [
        {
            mealName: 'Grilled Chicken Salad',
            calories: 400,
            protein: 40,
            carbs: 20,
            fat: 10,
            ingredients: [
                'garlic cloves, peeled',
                'olive oil',
                'skinless, boneless chicken breasts or thighs',
                'Dijon or whole grain mustard',
                'red wine vinegar',
                'pitted olives',
                '(packed) arugula (not baby)',
                'flat-leaf parsley leaves',
                'roasted red peppers from a jar, cut into 1/2-inch-wide strips'
            ],
            ingredientAmounts: ['20', '1 cup', '1 pound', '2 tablespoons', '2 tablespoons', '1/4 cup', '4 cups', '1/4 cup', '3'],
            imageUrl: '/grilled_chicken_salad.jpeg',
            recipeUrl: 'https://www.bonappetit.com/recipe/grilled-chicken-salad-with-garlic-confit',
        },
        {
            mealName: 'Avocado Toast with Poached Egg',
            calories: 350,
            protein: 15,
            carbs: 30,
            fat: 20,
            ingredients: [
                'whole-grain bread',
                'eggs, poached or hard-boiled (with no added fat)',
                'avocado'
            ],
            ingredientAmounts: ['2 slices', '2', '2 tbsp. (1 ounce)'],
            imageUrl: '/avocado_toast.jpg',
            recipeUrl: 'https://www.upmcmyhealthmatters.com/avocado-toast/',
        },
        {
            mealName: 'Smoothie Bowl',
            calories: 350,
            protein: 20,
            carbs: 40,
            fat: 15,
            ingredients: [
                'almond milk',
                'frozen banana',
                'frozen mixed berries',
                'nonfat Greek yogurt (optional)',
                'blueberries',
                'raspberries',
                'granola',
                'pepita seeds',
                'blackberry'
            ],
            ingredientAmounts: ['1 cup', '1/2', '1 cup', '1 tablespoon', '1/3 cup', '1/4 cup', '2 tablespoons', '1 tablespoon', '1'],
            imageUrl: '/smoothie_bowl.jpeg',
            recipeUrl: 'https://www.example.com/smoothie-bowl-recipe',
        },
    ];

    // Sample posts data
    const postsData = [
        {
            title: 'Healthy Lunch Ideas',
            bodyContent: 'Here are some delicious and healthy meals I made this week!',
            user: users[0], // Alice
            foodData: foodDataArray[0], // Grilled Chicken Salad
        },
        {
            title: 'Breakfast Favorites',
            bodyContent: 'Starting my day right with these amazing breakfasts!',
            user: users[1], // Jane
            foodData: foodDataArray[1], // Avocado Toast
        },
        {
            title: 'Smoothie Bowl Recipe',
            bodyContent: 'A refreshing start to your day!',
            user: users[2], // Bob
            foodData: foodDataArray[2], // Smoothie Bowl
        },
    ];

    return (
        <div className="bg-gray-800 min-h-screen p-6">
            <h1 className="text-3xl font-bold text-white mb-6">My Posts</h1>
            <div className="space-y-6">
                {postsData.map((post, index) => (
                    <Post
                        key={index}
                        user={post.user} // Pass user object for each post
                        title={post.title}
                        bodyContent={post.bodyContent}
                        foodData={post.foodData}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostPage;

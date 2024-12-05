import React from "react";
import Post from "../components/Post"; // Import your Post component

const Feed = () => {
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
            name: "Michael",
            surname: "Williams",
            username: "williams",
            profilePic: "/man1.jpg", // Replace with actual path
            rating: 4
        },
        {
            id: 3,
            name: "Jane",
            surname: "Doe",
            username: "jane_doe",
            profilePic: "/woman2.jpg", // Replace with actual path
            rating: 5,
        },
        {
            id: 4,
            name: "Bob",
            surname: "Johnson",
            username: "bob_johnson",
            profilePic: "/man2.jpg", // Replace with actual path
            rating: 3,
        },
    ];

    // Sample food (meal) data for each user
    const mealsData = [
        [
            {
                "foodName": "Scrambled Eggs with Avocado and Bacon",
                "calories": 450,
                "protein": 25,
                "carbs": 5,
                "fat": 35,
                "ingredients": [
                    "eggs",
                    "bacon",
                    "avocado",
                    "olive oil"
                ],
                "ingredientAmounts": ["3", "2 slices", "1/2", "1 tsp"],
                "imageUrl": "/scrambled_eggs_bacon.jpg",
                "recipeUrl": "https://www.taste.com.au/recipes/scrambled-eggs-bacon-avocado/5791598d-9e24-4627-b522-566ede4574ec"
            },
            {
                "foodName": "Cobb Salad with Grilled Chicken",
                "calories": 500,
                "protein": 45,
                "carbs": 10,
                "fat": 30,
                "ingredients": [
                    "grilled chicken breast",
                    "romaine lettuce",
                    "bacon",
                    "hard-boiled eggs",
                    "avocado",
                    "cherry tomatoes",
                    "olive oil",
                    "lemon juice"
                ],
                "ingredientAmounts": ["1 breast", "2 cups", "2 slices", "2", "1/2", "1/2 cup", "2 tbsp", "1 tbsp"],
                "imageUrl": "/cobb_salad.jpg",
                "recipeUrl": "https://chefsavvy.com/grilled-chicken-cobb-salad/"
            },
            {
                "foodName": "Grilled Salmon with Asparagus",
                "calories": 550,
                "protein": 40,
                "carbs": 10,
                "fat": 35,
                "ingredients": [
                    "salmon fillet",
                    "asparagus",
                    "olive oil",
                    "lemon",
                    "garlic"
                ],
                "ingredientAmounts": ["1 fillet", "1 bunch", "2 tbsp", "1", "2 cloves"],
                "imageUrl": "/grilled_salmon_asparagus.jpg",
                "recipeUrl": "https://www.somewhatsimple.com/grilled-salmon/"
            },
            {
                "foodName": "Paleo Beef Jerky Snack",
                "calories": 150,
                "protein": 20,
                "carbs": 2,
                "fat": 7,
                "ingredients": [
                    "beef strips",
                    "coconut aminos",
                    "garlic powder",
                    "onion powder",
                    "smoked paprika"
                ],
                "ingredientAmounts": ["1/2 pound", "1/4 cup", "1 tsp", "1 tsp", "1 tsp"],
                "imageUrl": "/beef_jerky.jpg",
                "recipeUrl": "https://whatgreatgrandmaate.com/paleo-beef-jerky/"
            },
            {
                "foodName": "Zucchini Noodles with Pesto and Grilled Shrimp",
                "calories": 480,
                "protein": 35,
                "carbs": 12,
                "fat": 32,
                "ingredients": [
                    "zucchini (spiralized)",
                    "shrimp (grilled)",
                    "basil pesto",
                    "olive oil"
                ],
                "ingredientAmounts": ["2", "1/2 pound", "1/4 cup", "1 tbsp"],
                "imageUrl": "/zucchini_noodles_shrimp.jpg",
                "recipeUrl": "https://www.slenderkitchen.com/recipe/pesto-shrimp-with-zucchini-noodles"
            }
        ],
        [
            {
                "foodName": "Gluten-Free Oatmeal with Berries and Almond Butter",
                "calories": 350,
                "protein": 10,
                "carbs": 50,
                "fat": 15,
                "ingredients": [
                    "gluten-free oats",
                    "almond butter",
                    "mixed berries",
                    "honey"
                ],
                "ingredientAmounts": ["1/2 cup", "1 tbsp", "1/2 cup", "1 tsp"],
                "imageUrl": "/gf_oatmeal_berries.jpg",
                "recipeUrl": "https://marisamoore.com/berry-nut-butter-oatmeal/"
            },
            {
                "foodName": "Grilled Chicken Caesar Salad (Gluten-Free)",
                "calories": 450,
                "protein": 40,
                "carbs": 8,
                "fat": 30,
                "ingredients": [
                    "grilled chicken breast",
                    "romaine lettuce",
                    "gluten-free Caesar dressing",
                    "parmesan cheese",
                    "gluten-free croutons"
                ],
                "ingredientAmounts": ["1 breast", "2 cups", "2 tbsp", "1 tbsp", "1/4 cup"],
                "imageUrl": "/gf_chicken_caesar_salad.jpg",
                "recipeUrl": "https://damndelicious.net/2023/04/21/best-chicken-caesar-salad-with-homemade-croutons/"
            },
            {
                "foodName": "Gluten-Free Spaghetti with Marinara and Meatballs",
                "calories": 600,
                "protein": 35,
                "carbs": 60,
                "fat": 25,
                "ingredients": [
                    "gluten-free spaghetti",
                    "ground beef",
                    "marinara sauce",
                    "garlic",
                    "parmesan cheese",
                    "olive oil"
                ],
                "ingredientAmounts": ["1 cup", "1/2 pound", "1/2 cup", "2 cloves", "2 tbsp", "1 tbsp"],
                "imageUrl": "/gf_spaghetti_meatballs.jpg",
                "recipeUrl": "https://www.letthemeatgfcake.com/gluten-free-pasta-with-meatballs-and-sausage/"
            },
            {
                "foodName": "Rice Cakes with Peanut Butter and Banana",
                "calories": 200,
                "protein": 6,
                "carbs": 28,
                "fat": 9,
                "ingredients": [
                    "gluten-free rice cakes",
                    "peanut butter",
                    "banana"
                ],
                "ingredientAmounts": ["2", "2 tbsp", "1/2"],
                "imageUrl": "/gf_rice_cakes_pb_banana.jpg",
                "recipeUrl": "https://jennifermaune.com/peanut-butter-banana-rice-cakes/"
            },
            {
                "foodName": "Grilled Salmon with Quinoa and Steamed Vegetables",
                "calories": 500,
                "protein": 35,
                "carbs": 45,
                "fat": 20,
                "ingredients": [
                    "salmon fillet",
                    "quinoa",
                    "broccoli",
                    "carrots",
                    "olive oil",
                    "lemon"
                ],
                "ingredientAmounts": ["1 fillet", "1/2 cup", "1 cup", "1 cup", "1 tbsp", "1/2"],
                "imageUrl": "/gf_grilled_salmon_quinoa.jpg",
                "recipeUrl": "https://tealnotes.com/grilled-salmon-with-quinoa-and-roasted-vegetables/"
            }
        ],
        [
            {
                "foodName": "Omelette with Herbs and Smoked Salmon",
                "calories": 400,
                "protein": 30,
                "carbs": 4,
                "fat": 30,
                "ingredients": [
                    "eggs",
                    "smoked salmon",
                    "fresh chives",
                    "fresh parsley",
                    "olive oil"
                ],
                "ingredientAmounts": ["3", "2 oz", "1 tbsp", "1 tbsp", "1 tsp"],
                "imageUrl": "/omelette_herbs_salmon.jpg",
                "recipeUrl": "https://www.food.com/recipe/smoked-salmon-omelet-with-herbs-283505"
            },
            {
                "foodName": "Grilled Chicken Ratatouille",
                "calories": 500,
                "protein": 40,
                "carbs": 30,
                "fat": 20,
                "ingredients": [
                    "grilled chicken breast",
                    "eggplant",
                    "zucchini",
                    "bell peppers",
                    "tomatoes",
                    "olive oil",
                    "garlic",
                    "thyme"
                ],
                "ingredientAmounts": ["1 breast", "1/2", "1", "1", "2", "2 tbsp", "2 cloves", "1 tsp"],
                "imageUrl": "/chicken_ratatouille.jpg",
                "recipeUrl": "https://emeals.com/recipes/recipe-30914-201282-Grilled-Chicken-Ratatouille"
            },
            {
                "foodName": "Nicoise Salad with Tuna",
                "calories": 450,
                "protein": 35,
                "carbs": 25,
                "fat": 20,
                "ingredients": [
                    "canned tuna",
                    "green beans",
                    "boiled eggs",
                    "potatoes",
                    "olives",
                    "anchovies",
                    "olive oil",
                    "lemon juice"
                ],
                "ingredientAmounts": ["1 can", "1/2 cup", "2", "2 small", "1/4 cup", "2", "2 tbsp", "1 tbsp"],
                "imageUrl": "/nicoise_salad.jpg",
                "recipeUrl": "https://www.recipetineats.com/nicoise-salad-french-salad-with-tuna/"
            },
            {
                "foodName": "Coq au Vin (Sport-Friendly)",
                "calories": 600,
                "protein": 45,
                "carbs": 20,
                "fat": 25,
                "ingredients": [
                    "chicken thighs",
                    "red wine",
                    "mushrooms",
                    "carrots",
                    "pearl onions",
                    "garlic",
                    "olive oil",
                    "thyme"
                ],
                "ingredientAmounts": ["4", "1 cup", "1/2 cup", "2", "1/4 cup", "2 cloves", "1 tbsp", "1 tsp"],
                "imageUrl": "/coq_au_vin.jpg",
                "recipeUrl": "https://davethewinemerchant.com/food-wine-recipes/recipe-coq-au-vin/"
            },
            {
                "foodName": "French Apple Tart (Healthy Version)",
                "calories": 300,
                "protein": 5,
                "carbs": 55,
                "fat": 10,
                "ingredients": [
                    "apples",
                    "gluten-free flour",
                    "almond flour",
                    "coconut sugar",
                    "butter",
                    "cinnamon"
                ],
                "ingredientAmounts": ["2", "1/2 cup", "1/2 cup", "2 tbsp", "2 tbsp", "1 tsp"],
                "imageUrl": "/french_apple_tart.jpg",
                "recipeUrl": "https://gohealthywithbea.com/apple-pie/"
            }
        ],
        [
            {
                "foodName": "Yogurt with Honey and Walnuts",
                "calories": 300,
                "protein": 10,
                "carbs": 30,
                "fat": 15,
                "ingredients": [
                    "yogurt",
                    "honey",
                    "walnuts"
                ],
                "ingredientAmounts": ["1 cup", "1 tbsp", "1/4 cup"],
                "imageUrl": "/yogurt_walnuts.jpg",
                "recipeUrl": "hhttps://www.mygreekdish.com/recipe/greek-yogurt-with-honey-walnuts-recipe-yiaourti-meli/"
            },
            {
                "foodName": "Quick Veggie Omelette",
                "calories": 250,
                "protein": 20,
                "carbs": 5,
                "fat": 15,
                "ingredients": [
                    "eggs",
                    "spinach",
                    "bell peppers",
                    "feta cheese",
                    "olive oil"
                ],
                "ingredientAmounts": ["2", "1 cup", "1/2 cup", "1/4 cup", "1 tsp"],
                "imageUrl": "/veggie_omelette.jpg",
                "recipeUrl": "https://www.allrecipes.com/recipe/14057/yummy-veggie-omelet/"
            },
            {
                "foodName": "Chicken Caesar Salad",
                "calories": 400,
                "protein": 35,
                "carbs": 15,
                "fat": 25,
                "ingredients": [
                    "cooked chicken breast",
                    "romaine lettuce",
                    "Caesar dressing",
                    "croutons",
                    "parmesan cheese"
                ],
                "ingredientAmounts": ["1 cup", "2 cups", "2 tbsp", "1/4 cup", "2 tbsp"],
                "imageUrl": "/chicken_caesar_salad.jpg",
                "recipeUrl": "https://www.bbcgoodfood.com/recipes/chicken-caesar-salad"
            },
            {
                "foodName": "Tuna Salad on Whole Grain Bread",
                "calories": 350,
                "protein": 30,
                "carbs": 30,
                "fat": 10,
                "ingredients": [
                    "canned tuna",
                    "whole grain bread",
                    "mayonnaise",
                    "celery",
                    "lettuce"
                ],
                "ingredientAmounts": ["1 can", "2 slices", "1 tbsp", "1/4 cup", "1 leaf"],
                "imageUrl": "/tuna_salad_sandwich.jpg",
                "recipeUrl": "https://www.food.com/recipe/dijon-cilantro-tuna-salad-on-whole-grain-bread-359277"
            },
            {
                "foodName": "Banana Protein Smoothie",
                "calories": 250,
                "protein": 25,
                "carbs": 40,
                "fat": 5,
                "ingredients": [
                    "banana",
                    "protein powder",
                    "almond milk",
                    "peanut butter"
                ],
                "ingredientAmounts": ["1", "1 scoop", "1 cup", "1 tbsp"],
                "imageUrl": "/banana_protein_smoothie.jpg",
                "recipeUrl": "https://www.asweetpeachef.com/banana-protein-shake/"
            }
        ]
    ];

    // Sample posts data
    const postsData = [
        {
            title: 'Tasty Paleo Meal Ideas to Fuel Your Day!',
            bodyContent: "Starting my paleo journey has been an exciting adventure, and I want to share some of my favorite meals! 🥑 I kick off my mornings with Scrambled Eggs with Avocado and Bacon—what a great way to start the day! 🥚 For lunch, a Cobb Salad with Grilled Chicken feels like a gourmet treat. Dinner is all about Grilled Salmon with Asparagus—it's simply delicious! 🎣 For a quick snack, I grab some Paleo Beef Jerky. Finally, Zucchini Noodles with Pesto and Grilled Shrimp are my go-to low-carb delight. Who knew noodles could be this a-peeling? 🍜✨ Eating paleo has made healthy eating easy and delicious—let’s dig in together! 🍽️"
            ,
            user: users[0],
            meals: mealsData[0],
        },
        {
            title: 'Delicious Gluten-Free Meal Ideas for a Celiac Diet!',
            bodyContent: 'Finding a reliable list of meals for a celiac diet can be quite a challenge, but I’m here to help! ' +
                '\nAfter some searching, I’ve put together a selection of delicious gluten-free options that are both satisfying and easy to prepare. ' +
                '\nWhether you\'re looking for breakfast, lunch, or dinner ideas, I\'ve got you covered with meals that are safe for those with celiac disease. ' +
                '\nLet’s dive in and enjoy these tasty, gluten-free dishes together!',
            user: users[1],
            meals: mealsData[1],
        },
        {
            title: 'Indulge in a Flavorful French Cuisine Diet Without Compromise!',
            bodyContent: 'I’ve prepared a diet plan for you that will take you to the heights of flavor from French cuisine without compromising on your preferences!',
            user: users[2],
            meals: mealsData[2],
        },
        {
            title: 'Fuel Your Busy Life: Quick & Delicious Meals for On-the-Go!',
            bodyContent: "Don't let a busy, fast-paced lifestyle get in the way of healthy eating! " +
                "\nI’ve put together a quick and easy meal plan that fits perfectly into your hectic schedule. " +
                "\nWith simple, nutritious options, you can nourish your body without sacrificing flavor or convenience. " +
                "\nLet’s make healthy eating a breeze, even on your busiest days!"
            ,
            user: users[3],
            meals: mealsData[3],
        }
    ];

    return (
        <div className="bg-gray-800 min-h-screen p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Feed</h1>
            <div className="space-y-6">
                {postsData.map((post, index) => (
                    <Post
                        key={index}
                        user={post.user} // Pass user object for each post
                        title={post.title}
                        bodyContent={post.bodyContent}
                        meals={post.meals} // Pass meals array for each post
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed;

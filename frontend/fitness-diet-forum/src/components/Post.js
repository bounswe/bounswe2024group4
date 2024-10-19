import React from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import Food from "../components/Food"; // Import the Food component

const Post = ({ user, title, bodyContent, meals }) => {
    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg mb-6 max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-4">
                <img
                    src={user.profilePic} // Dynamically loads profile picture
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                    {/* Updated line to include surname */}
                    <h3 className="text-xl font-semibold">{user.name} {user.surname} @{user.username}</h3>
                    <div className="flex items-center text-yellow-400">
                        {/* Dynamic rating */}
                        {[...Array(5)].map((_, i) => (
                            <IoIosStar key={i} className={i < user.rating ? "text-yellow-400" : "text-gray-500"} />
                        ))}
                        <span className="text-gray-300 ml-2">{user.rating}</span>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <div className="mb-4">{bodyContent}</div> {/* Body content can be text or an image */}

            {/* Scrollable List of Food Components (Meals) */}
            <div className="h-96 overflow-y-scroll mb-4">
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
                        recipeUrl={meal.recipeUrl}
                    />
                ))}
            </div>

            {/* Actions: Like & Comment */}
            <div className="flex justify-between mt-4 text-gray-400">
                <button className="flex items-center">
                    <FaHeart className="mr-2" /> Like
                </button>
                <button className="flex items-center">
                    <FaComment className="mr-2" /> Comment
                </button>
            </div>
        </div>
    );
};

export default Post;

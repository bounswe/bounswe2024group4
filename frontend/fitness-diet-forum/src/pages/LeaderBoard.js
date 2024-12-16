import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/index.css";
import { Context } from "../globalContext/globalContext.js";

const LeaderBoard = () => {
    const [users, setUsers] = useState([]);
    const [workoutUsers, setWorkoutUsers] = useState([]);
    const [mealUsers, setMealUsers] = useState([]);
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
        const fetchLeaderboards = async () => {
            try {
                const leaderboardResponses = await Promise.all([
                    axios.get(baseURL + "/get_leaderboard/", config),
                    axios.get(baseURL + "/get_workout_leaderboard/", config),
                    axios.get(baseURL + "/get_meal_leaderboard/", config),
                ]);

                const [mainLeaderboard, workoutLeaderboard, mealLeaderboard] = leaderboardResponses;

                if (mainLeaderboard.status === 200) {
                    setUsers(mainLeaderboard.data.leaderboard);
                }

                if (workoutLeaderboard.status === 200) {
                    setWorkoutUsers(workoutLeaderboard.data.workout_leaderboard);
                }

                if (mealLeaderboard.status === 200) {
                    setMealUsers(mealLeaderboard.data.meal_leaderboard);
                }
            } catch (err) {
                setError("Something went wrong. Please try again later.");
            }
        };

        fetchLeaderboards();
    }, [baseURL]);

    const renderStars = (score) => {
        if (typeof score !== "number" || isNaN(score) || score < 0 || score > 5) {
            return null; // If the score is not a valid number or out of range, do not render stars.
        }

        const fullStars = Math.floor(score);
        const halfStar = score % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                ))}
                {halfStar === 1 && <span className="text-yellow-400">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={i + fullStars + halfStar} className="text-gray-400">☆</span>
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-300">
                    {score.toFixed(1)}
                </span>
            </div>
        );
    };

    const renderLeaderboard = (leaderboard, ratingAttribute) => (
        <div className="leaderboard-list">
            {leaderboard.map((user, index) => (
                <div
                    key={user.username}
                    className="user-item flex items-center justify-between bg-gray-900 text-white p-4 mb-4 rounded-lg shadow-md hover:shadow-lg"
                >
                    <div className="flex items-center">
                        <Link
                            to={`/profile/${user.username}`}
                            className="text-lg font-bold text-blue-400 hover:underline"
                        >
                            <img
                                src={
                                    user.profile_picture
                                    ? (baseURL + '/' + user.profile_picture)
                                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                }
                                alt={`${user.username}'s profile`}
                                className="w-16 h-16 rounded-full border-2 border-gray-600"
                            />
                        </Link>
                        <div className="ml-4">
                            <Link
                                to={`/profile/${user.username}`}
                                className="text-lg font-bold text-blue-400 hover:underline"
                            >
                                {user.username}
                            </Link>
                            <div className="text-gray-400">
                                {renderStars(user[ratingAttribute])}
                            </div>
                        </div>
                    </div>
                    <div className="ranking text-xl font-bold text-gray-300">
                        #{index + 1}
                    </div>
                </div>
            ))}
        </div>
    );

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <h1 className="text-white text-2xl">{error}</h1>
            </div>
        );
    }

    if (!users.length && !workoutUsers.length && !mealUsers.length) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <h1 className="text-white text-2xl">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="leaderboard-page bg-gray-800 min-h-screen py-10">
            <h1 className="text-3xl text-white font-bold text-center mb-8">
                Leaderboards
            </h1>
            <div className="leaderboard-container grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                <div>
                    <h2 className="text-2xl text-white font-semibold text-center mb-4">
                        Overall Leaderboard
                    </h2>
                    {renderLeaderboard(users, "score")}
                </div>
                <div>
                    <h2 className="text-2xl text-white font-semibold text-center mb-4">
                        Workout Leaderboard
                    </h2>
                    {renderLeaderboard(workoutUsers, "workout_rating")}
                </div>
                <div>
                    <h2 className="text-2xl text-white font-semibold text-center mb-4">
                        Meal Leaderboard
                    </h2>
                    {renderLeaderboard(mealUsers, "meal_rating")}
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;

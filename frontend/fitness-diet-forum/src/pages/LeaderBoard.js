import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/index.css";
import { Context } from "../globalContext/globalContext.js";

const LeaderBoard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(baseURL + "/get_leaderboard/");
                console.log(response.data);
                if (response.status === 200) {
                    setUsers(response.data.leaderboard);
                } else {
                    setError("Unable to fetch leaderboard data.");
                }
            } catch (err) {
                setError("Something went wrong. Please try again later.");
            }
        };

        fetchLeaderboard();
    }, []);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <h1 className="text-white text-2xl">{error}</h1>
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <h1 className="text-white text-2xl">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="leaderboard-page bg-gray-800 min-h-screen py-10">
            <h1 className="text-3xl text-white font-bold text-center mb-8">
                Leaderboard
            </h1>
            <div className="leaderboard-list mx-auto max-w-4xl px-4">
                {users.map((user, index) => (
                    <div
                        key={user.user_id}
                        className="user-item flex items-center justify-between bg-gray-900 text-white p-4 mb-4 rounded-lg shadow-md hover:shadow-lg"
                    >
                        {/* Profile Section */}
                        <div className="flex items-center">
                            <Link
                                to={`/profile/${user.username}`}
                                className="text-lg font-bold text-blue-400 hover:underline"
                            >
                                <img
                                    src={user.profile_picture || "/default-avatar.png"}
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
                                <p className="text-gray-400">Score: {user.score}</p>
                            </div>
                        </div>
                        {/* Ranking */}
                        <div className="ranking text-xl font-bold text-gray-300">
                            #{index + 1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderBoard;

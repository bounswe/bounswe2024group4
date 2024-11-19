import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // You can use fetch as well
import Meal from '../components/Meal'; // Assuming you have the Meal component
import ExerciseProgram from '../components/ExerciseProgram'; // Assuming you have the ExerciseProgram component
import '../css/index.css';

const ProfilePage = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}view_profile/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    setError('User not found');
                }
            } catch (error) {
                setError('Something went wrong');
            }
        };

        fetchUserData();
    }, [username]);

    // Inline style for error handling
    const errorContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', /* Full viewport height */
        backgroundColor: '#2d3748', /* Dark background */
    };

    const errorMessageStyle = {
        fontSize: '2rem',
        color: '#f7fafc', /* Light color for text */
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', /* Slight background to make text stand out */
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    if (error) {
        return (
            <div style={errorContainerStyle}>
                <h1 style={errorMessageStyle}>{error}</h1>
            </div>
        );
    }

    // Render loading screen while userData is being fetched
    if (!userData) {
        return (
            <div style={errorContainerStyle}>
                <h1 style={errorMessageStyle}>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="profile-page-container bg-gray-800 text-lightText">
            {/* User Profile Header */}
            <div className="profile-header flex flex-col items-center">
                <img
                    src={userData.profile_picture}
                    alt="Profile"
                    className="profile-picture w-32 h-32 rounded-full border-4 border-gray-600 mb-4"
                />
                <h2 className="username text-3xl font-semibold">{userData.username}</h2>
                <p className="email text-lg">{userData.email}</p>
                <p className="bio mt-4 text-center">{userData.bio}</p>
                
                {/* Followers and Following Count */}
                <div className="followers-following mt-4 flex space-x-6">
                    <div className="followers">
                        <p>{userData.followers_count} Followers</p>
                    </div>
                    <div className="following">
                        <p>{userData.following_count} Following</p>
                    </div>
                </div>

                {/* Follow Button */}
                <button className={`follow-btn mt-4 px-6 py-2 rounded-lg text-white ${userData.is_following ? 'bg-gray-600' : 'bg-blue-500'} hover:bg-blue-700`}>
                    {userData.is_following ? 'Following' : 'Follow'}
                </button>
            </div>

            {/* User's Weight History */}
            <div className="weight-history mt-8">
                <h3 className="text-xl font-semibold">Weight History</h3>
                <ul>
                    {userData.weight_history.map((entry, index) => (
                        <li key={index} className="mt-2">
                            <p>{entry.date}: {entry.weight} kg</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* User's Score */}
            <div className="user-score mt-8">
                <h3 className="text-xl font-semibold">Score</h3>
                <p>{userData.score}</p>
            </div>

            {/* Meals Section (Assuming you have meal data) */}
            {userData.meals && (
                <div className="user-meals mt-8">
                    <h3 className="text-2xl font-semibold">Meals</h3>
                    {userData.meals.map((meal, index) => (
                        <Meal key={index} mealName={meal.name} foods={meal.foods} onDelete={() => {}} />
                    ))}
                </div>
            )}

            {/* Exercise Programs Section (Assuming you have exercise program data) */}
            {userData.workouts && (
                <div className="user-exercises mt-8">
                    <h3 className="text-2xl font-semibold">Exercise Programs</h3>
                    {userData.workouts.map((workout, index) => (
                        <ExerciseProgram
                            key={index}
                            programName={workout.name}
                            exercises={workout.exercises}
                            onDelete={() => {}}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

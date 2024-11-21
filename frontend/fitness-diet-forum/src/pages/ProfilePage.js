import React, { useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Meal from '../components/Meal';
import ExerciseProgram from '../components/ExerciseProgram';
import Post from '../components/Post'; // Import Post component
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";

const ProfilePage = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('meals'); // Default section is 'meals'
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(baseURL + `/view_profile/?username=${username}`);
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

    const errorContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#2d3748',
    };

    const errorMessageStyle = {
        fontSize: '2rem',
        color: '#f7fafc',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

    if (!userData) {
        return (
            <div style={errorContainerStyle}>
                <h1 style={errorMessageStyle}>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 text-lightText min-h-screen p-6">
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

                <div className="followers-following mt-4 flex space-x-6">
                    <div className="followers">
                        <p>{userData.followers_count} Followers</p>
                    </div>
                    <div className="following">
                        <p>{userData.following_count} Following</p>
                    </div>
                </div>

                <button className={`follow-btn mt-4 px-6 py-2 rounded-lg text-white ${userData.is_following ? 'bg-gray-600' : 'bg-blue-500'} hover:bg-blue-700`}>
                    {userData.is_following ? 'Following' : 'Follow'}
                </button>
            </div>

            {/* Section Selector */}
            <div className="section-tabs mt-8 flex justify-center space-x-6">
                <button
                    className={`tab-btn px-4 py-2 rounded-lg text-white ${activeSection === 'posts' ? 'bg-blue-500' : 'bg-gray-600'}`}
                    onClick={() => setActiveSection('posts')}
                >
                    Posts
                </button>
                <button
                    className={`tab-btn px-4 py-2 rounded-lg text-white ${activeSection === 'meals' ? 'bg-blue-500' : 'bg-gray-600'}`}
                    onClick={() => setActiveSection('meals')}
                >
                    Meals
                </button>
                <button
                    className={`tab-btn px-4 py-2 rounded-lg text-white ${activeSection === 'exercises' ? 'bg-blue-500' : 'bg-gray-600'}`}
                    onClick={() => setActiveSection('exercises')}
                >
                    Exercises
                </button>
            </div>

            {/* Render Section Based on Active Tab */}
            <div className="section-content mt-8">
                {activeSection === 'posts' && (
                    <div className="posts-section">
                        {userData.posts && userData.posts.length > 0 ? (
                            userData.posts.map((post, index) => (
                                <Post
                                    key={index}
                                    user={post.user}
                                    title={post.title}
                                    bodyContent={post.bodyContent}
                                    meals={post.meals}
                                />
                            ))
                        ) : (
                            <p>No posts.</p>
                        )}
                    </div>
                )}

                {activeSection === 'meals' && (
                    <div className="meals-section">
                        {userData.meals && userData.meals.length > 0 ? (
                            userData.meals.map((meal, index) => (
                                <div key={index} className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
                                    <h3 className="text-lg font-bold mb-2">{meal.name}</h3>
                                    <Meal mealName={meal.name} foods={meal.foods} onDelete={() => {}} />
                                </div>
                            ))
                        ) : (
                            <p>No meals.</p>
                        )}
                    </div>
                )}

                {activeSection === 'exercises' && (
                    <div className="exercises-section">
                        {userData.workouts && userData.workouts.length > 0 ? (
                            userData.workouts.map((workout, index) => (
                                <div key={index} className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
                                    <h3 className="text-lg font-bold mb-2">{workout.name}</h3>
                                    <ExerciseProgram
                                        programName={workout.name}
                                        exercises={workout.exercises}
                                        onDelete={() => {}}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No exercise programs.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

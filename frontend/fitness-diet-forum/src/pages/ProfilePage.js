import React, { useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Meal from '../components/Meal';
import ExerciseProgram from '../components/ExerciseProgram';
import Post from '../components/Post';
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";

const ProfilePage = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('meals');
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const loggedInUser = localStorage.getItem("username");
    const csrf_token = localStorage.getItem("csrfToken");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(baseURL + `/view_profile/?username=${username}`);
                if (response.status === 200) {
                    const data = response.data;
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

    const renderStars = (score) => {
        if (typeof score !== 'number' || isNaN(score) || score < 0 || score > 5) {
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
                {halfStar === 1 && <span className="text-yellow-400">☆</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={i + fullStars + halfStar} className="text-gray-400">☆</span>
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-300">
                    {score.toFixed(1)}
                </span>
            </div>
        );
    };

    const handleFollow = async () => {
        try {
            const action = userData.is_following ? 'unfollow' : 'follow';
            const config = {
                withCredentials: true,
                headers: {
                  "Content-Type": "multipart/form-data",
                  "X-CSRFToken": csrf_token,
                },
              };
            console.log(csrf_token);
            const response = await axios.post(baseURL + `/${action}/`, { following: username, follower: loggedInUser }, config);
            if (response.status === 200) {
                // Toggle the is_following status
                setUserData(prevData => ({
                    ...prevData,
                    is_following: !prevData.is_following,
                    followers_count: prevData.is_following ? prevData.followers_count - 1 : prevData.followers_count + 1,
                }));
            }
        } catch (error) {
            setError('Something went wrong while updating follow status');
        }
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
        <div className="profile-page flex flex-col md:flex-row min-h-screen">
            {/* Left Side: Profile Info */}
            <div className="profile-info w-full md:w-1/4 flex flex-col items-start p-8 bg-gray-800 rounded-lg shadow-md mb-6 md:mb-0">
                {/* Profile Picture */}
                <div className="flex justify-start mb-6">
                    <img
                        src={userData.profile_picture}
                        alt="Profile"
                        className="profile-picture w-32 h-32 rounded-full border-4 border-gray-600"
                    />
                </div>

                {/* Username, Bio, Score */}
                <div className="flex flex-col items-start mb-6">
                    <h2 className="username text-3xl font-semibold text-white">{userData.username}</h2>
                    <p className="bio mt-2 text-lg text-gray-300">{userData.bio}</p>
                    <div className="score mt-4">
                        {renderStars(userData.score)}
                    </div>
                </div>

                {/* Followers and Following */}
                <div className="followers-following flex items-center space-x-4 mb-6">
                    <p className="text-white">{userData.followers_count} Followers</p>
                    <p className="text-white">{userData.following_count} Following</p>
                </div>

                {/* Follow Button */}
                {loggedInUser !== username && (
                    <button
                        className={`follow-btn px-6 py-2 rounded-lg text-white ${
                            userData.is_following ? 'bg-gray-600' : 'bg-blue-500'
                        } hover:bg-blue-700`}
                        onClick={handleFollow}
                    >
                        {userData.is_following ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>

            {/* Right Side: Section Tabs (Posts, Meals, Exercises) */}
            <div className="section-tabs w-full md:w-2/3 flex flex-col items-center justify-start p-8">
                {/* Tabs */}
                <div className="tabs flex mb-6 space-x-4 justify-start w-full">
                    <button
                        className={`tab-btn px-6 py-2 rounded-lg text-white ${activeSection === 'posts' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-700`}
                        onClick={() => setActiveSection('posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={`tab-btn px-6 py-2 rounded-lg text-white ${activeSection === 'meals' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-700`}
                        onClick={() => setActiveSection('meals')}
                    >
                        Meals
                    </button>
                    <button
                        className={`tab-btn px-6 py-2 rounded-lg text-white ${activeSection === 'exercises' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-700`}
                        onClick={() => setActiveSection('exercises')}
                    >
                        Exercises
                    </button>
                </div>

                {/* Render Section Based on Active Tab */}
                <div className="section-content w-full">
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
                                <p className="text-white">No posts.</p>
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
                                <p className="text-white">No meals.</p>
                            )}
                        </div>
                    )}

                    {activeSection === 'exercises' && (
                        <div className="exercises-section">
                            {userData.workouts && userData.workouts.length > 0 ? (
                                userData.workouts.map((workout, index) => (
                                    <div key={index} className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
                                        <h3 className="text-lg font-bold mb-2">{workout.name}</h3>
                                        <ExerciseProgram workoutName={workout.name} exercises={workout.exercises} onDelete={() => {}} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-white">No exercises.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
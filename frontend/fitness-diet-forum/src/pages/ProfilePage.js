import React, { useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Meal from '../components/Meal';
import ExerciseProgram from '../components/ExerciseProgram';
import Post from '../components/Post';
import EditProfileForm from "../components/EditProfileForm.js";
import WeightGraph from "../components/WeightGraph.js";
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";

const ProfilePage = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [programs, setPrograms] = useState();
    const [meals, setMeals] = useState([]);
    const [mealsWithDetail, setMealsWithDetail] = useState([]);
    const [posts, setPosts] = useState([]);
    const [profilePictureURL, setProfilePictureURL] = useState("");
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('posts');
    const [showEditForm, setShowEditForm] = useState(false);
    const globalContext = useContext(Context);
    const { baseURL } = globalContext;
    const loggedInUser = localStorage.getItem("username");
    const ownProfile = loggedInUser === username;
    const [condition, setCondition] = useState(false);
    const [postDeleted, setPostDeleted] = useState(false);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        'Authorization': 'Token ' + token
      }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(baseURL + `/view_profile/?viewed_username=${username}`, config);
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data)
                    setUserData(data);
                    setPosts(data.posts);
                    setProfilePictureURL(baseURL + data.profile_picture);
                    fetchExercisePrograms(data.workouts);
                    fetchMeals(data.meals);
                    setCondition(data.user_type === "super_member")
                } else {
                    setError('User not found');
                }
            } catch (error) {
                setError('Something went wrong');
            }
        };

        fetchUserData();
    }, [username, postDeleted]);

    const handleEditProfile = () => {
        setShowEditForm(true);
    };    

    const handleExercisePrograms = async (workouts) => {
        setActiveSection('exercises');
        fetchExercisePrograms(workouts);
    }

    const handleMeals = async (meals) => {
        setActiveSection('meals');
        fetchMeals(meals);
    }

    const fetchExercisePrograms = async (workouts) => {
        try {
            const workoutDetailsPromises = workouts.map(async (workout) => {
                try {
                    const response = await axios.get(`${baseURL}/get-workout/${workout.workout_id}/`, config);
                    return response.data; // Extract workout data from the response
                } catch (error) {
                    console.error(`Error fetching details for workoutID ${workout.workout_id}:`, error);
                    return null; // Handle errors gracefully by returning null
                }
            });
    
            // Wait for all requests to resolve
            const workoutDetails = await Promise.all(workoutDetailsPromises);
    
            // Filter out any null results and update the programs state
            setPrograms(workoutDetails.filter((workout) => workout !== null));
        } catch (error) {
            console.error("Error fetching user programs:", error);
        }
    };

    const fetchMeals = async (meals) => {
        try {
            const mealDetailsPromises = meals.map(async (meal) => {
                try {
                    const response = await axios.get(`${baseURL}/get_meal_from_id/?meal_id=${meal.meal_id}`, config);
                    console.log(response.data);
                    return response.data; // Extract workout data from the response
                } catch (error) {
                    console.error(`Error fetching details for meal`, error);
                    return null; // Handle errors gracefully by returning null
                }
            });
    
            // Wait for all requests to resolve
            const mealDetails = await Promise.all(mealDetailsPromises);
    
            // Filter out any null results and update the programs state
            setMealsWithDetail(mealDetails.filter((meal) => meal !== null));
            console.log("MEALS:", mealsWithDetail);
        } catch (error) {
            console.error("Error fetching user meals:", error);
        }
    };

    const handleDeleteProgram = async (programId) => {
        const programToDelete = programs.find(program => program.id === programId);
        const updatedPrograms = programs.filter(program => program.id !== programId);
    
        setPrograms(updatedPrograms);
    
        try {
            const response = await axios.delete(`${baseURL}/workouts/delete/${programId}/`, config);
            
            if (response.status !== 200) {
                setPrograms(prevPrograms => [...prevPrograms, programToDelete]);
                throw new Error('Failed to delete the program.');
            }
        } catch (error) {
            console.error('Error deleting program:', error);
            setPrograms(prevPrograms => [...prevPrograms, programToDelete]);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            const deleteResponse = await axios.delete(`${baseURL}/meals/delete/${mealId}/`, config);
            if (deleteResponse.status === 200) {
                setMealsWithDetail(mealsWithDetail.filter((meal) => meal.meal_id !== mealId));
            }
        } catch (error) {
            setError('Could not delete meal.');
        }
    }

    const handlePostDelete = (postId) => {
        console.log('handlePostDelete called');
        setPostDeleted(!postDeleted);
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

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
                {halfStar === 1 && <span className="text-yellow-400">★</span>} {/* Half star */}
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
            console.log(userData.is_following);
            const action = userData.is_following ? 'unfollow' : 'follow';
            const body = userData.is_following ? { username: loggedInUser, following: username} : { follower: loggedInUser, following: username }
            const response = await axios.post(baseURL + `/${action}/`, body, config);
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
            <div className="profile-info w-full md:w-1/4 flex flex-col flex-start p-3 bg-gray-800 rounded-lg shadow-md mb-1 md:mb-0">
            {/* Profile Picture Wrapper */}
            <div className="flex justify-start mb-6 relative">
                {/* Condition to display the crown */}
                {condition && (
                    <img 
                        src="https://www.transparentpng.com/thumb/crown/X0pLjy-download-gold-king-crown-transparent-image.png" 
                        alt="download gold king crown transparent image @transparentpng.com"
                        className="absolute top-0 left-0 w-20 h-16"
                        style={{
                            transform: 'translate(-10%, -60%)',
                        }}
                    />
                )}

                {/* Profile Picture */}
                <img
                    src={
                        userData.profile_picture 
                        ? profilePictureURL
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
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
                {!ownProfile && (
                    <button
                        className={`follow-btn px-6 py-2 rounded-lg text-white ${
                            userData.is_following ? 'bg-gray-600' : 'bg-blue-500'
                        } hover:bg-blue-700`}
                        onClick={handleFollow}
                    >
                        {userData.is_following ? 'Unfollow' : 'Follow'}
                    </button>
                )}

                {/* Edit Profile Button */}
                {ownProfile && (
                    <>
                        <button
                            className="follow-btn px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700"
                            onClick={handleEditProfile}
                        >
                            Edit Profile
                        </button>
                        {showEditForm && (
                            <EditProfileForm
                                userData={userData}
                                onClose={() => setShowEditForm(false)}
                                onUpdate={(updatedData) => setUserData((prev) => ({ ...prev, ...updatedData }))}
                            />
                        )}
                        <div
                            className="px-6 py-2 rounded-lg text-white"
                            style={{
                                position: "relative",
                                marginTop: "20px",
                                width: "100%",
                                height: "300px",
                                padding: "2px",
                                borderRadius: "8px",
                            }}
                        >
                            Weight Journey
                            <WeightGraph weightData={userData.weight_history} />
                        </div>
                    </>
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
                        onClick={() =>  handleMeals(userData.meals)}
                    >
                        Meals
                    </button>
                    <button
                        className={`tab-btn px-6 py-2 rounded-lg text-white ${activeSection === 'exercises' ? 'bg-blue-500' : 'bg-gray-600'} hover:bg-blue-700`}
                        onClick={() => handleExercisePrograms(userData.workouts)}
                    >
                        Exercises
                    </button>
                </div>

                {/* Render Section Based on Active Tab */}
                <div className="section-content w-full">
                    {activeSection === 'posts' && (
                        <div className="posts-section">
                            {posts && posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <Post
                                        key={index}
                                        postId={post.post_id}
                                        user={userData}
                                        content={post.content}
                                        mealId={post.meal_id}
                                        workoutId={post.workout_id}
                                        like_count={post.like_count}
                                        liked={post.liked}
                                        created_at={post.created_at}
                                        isOwn={ownProfile}
                                        onDelete={handlePostDelete}
                                    />
                                ))
                            ) : (
                                <p className="text-white">No posts.</p>
                            )}
                        </div>
                    )}

                    {activeSection === 'meals' && (
                        <div className="meals-section">
                            {mealsWithDetail && mealsWithDetail.length > 0 ? (
                                mealsWithDetail.map((meal, index) => (
                                    <div key={index} className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-6 max-w-3xl mx-auto">
                                        <h3 className="text-lg font-bold mb-2">{meal.name}</h3>
                                        <Meal 
                                            mealName={meal.meal_name} 
                                            foods={meal.foods} 
                                            onDelete={() => handleDeleteMeal(meal.meal_id)}
                                            isOwn={ownProfile} 
                                            mealId={meal.meal_id}
                                            currentRating={meal.rating} 
                                            ratingCount={meal.rating_count}
                                            showRating={!ownProfile}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-white">No meals.</p>
                            )}
                        </div>
                    )}

                    {activeSection === 'exercises' && (
                        <div className="exercises-section">
                            {programs && programs.length > 0 ? (
                                programs.map((program) => (
                                    <ExerciseProgram
                                        key={program.id}  // Use `program.id` as the unique key
                                        programName={program.workout_name}
                                        exercises={program.exercises}
                                        onDelete={() => handleDeleteProgram(program.id)}
                                        isOwn = {loggedInUser === username}
                                        programId={program.id}
                                        currentRating={program.rating}
                                        ratingCount={program.rating_count}
                                        showRating = {loggedInUser != username}
                                    />
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

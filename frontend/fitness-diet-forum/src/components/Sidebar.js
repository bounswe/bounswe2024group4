import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaEnvelope, FaUtensils, FaDumbbell, FaTrophy, FaInfoCircle } from 'react-icons/fa';
import '../css/index.css';

const Sidebar = () => {
  const username = localStorage.getItem("username");
  const condition = localStorage.getItem("userType") === "super-member";

  return (
    <div className="flex flex-col h-screen fixed top-0 left-0 w-64 bg-black text-white p-4">
      <h1 className="text-xl font-bold text-left text-blue-500"> 
        FITNESS <br /> DIET <br /> FORUM
      </h1>
      <nav className="flex flex-col space-y-2 mt-6">
        <NavLink 
          to="/feed" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaHome /> <span>Home</span>
        </NavLink>
        <NavLink 
          to={`/profile/${username}`}
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaUser /> <span>Profile</span>
        </NavLink>
        <NavLink 
          to="/messages" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaEnvelope /> <span>Messages</span>
        </NavLink>
        <NavLink 
          to="/meals" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaUtensils /> <span>Meals</span>
        </NavLink>
        <NavLink 
          to="/Exercises" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaDumbbell /> <span>Exercises</span>
        </NavLink>
        <NavLink 
          to="/leaderboard" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaTrophy /> <span>Leaderboards</span>
        </NavLink>
      </nav>

      {/* Member Status */}
      <div className="mt-auto text-white">
        <p className="mb-2">
          {condition ? (
            <>{username}, you are a super-member in our community!
              <span className="relative group cursor-pointer">
                <FaInfoCircle className="inline-block ml-2" />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm rounded p-2 w-36 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  You now can create new exercises and food options.
                </span>
              </span>
            </>
          ) : (
            <></>
          )}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

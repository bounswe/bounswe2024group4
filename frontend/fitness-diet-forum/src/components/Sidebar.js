import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaEnvelope, FaUtensils, FaDumbbell, FaTrophy } from 'react-icons/fa';
import '../css/index.css';

const Sidebar = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col space-y-4">
      <h1 className="text-xl font-bold text-center text-blue-500"> 
        FITNESS <br /> DIET <br /> FORUM
      </h1>
      <nav className="flex flex-col space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaHome /> <span>Home</span>
        </NavLink>
        <NavLink 
          to="/profile" 
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
          to="/exercises" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaDumbbell /> <span>My Exercises</span>
        </NavLink>
        <NavLink 
          to="/leaderboard" 
          className={({ isActive }) => isActive ? 'bg-blue-700 p-2 rounded flex items-center space-x-2' : 'hover:bg-blue-700 p-2 rounded flex items-center space-x-2'}
        >
          <FaTrophy /> <span>Leaderboard</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;



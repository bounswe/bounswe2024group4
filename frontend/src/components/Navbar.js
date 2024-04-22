import React from 'react';
import logo from '../assets/logo.svg';
import "../pages/SignUpError.js";
import { Bars3Icon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// Navbar component
export function Navbar() {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    // Navigate to SignUpFail component
    navigate('/sign-up-prompt');
  };

  return (
    <header className="bg-white py-2 border border-slate-150">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex justify-between">
          <div className="menu-icon">
            <Bars3Icon className="h-10 text-black" />
          </div>
          <div className="logo flex ml-4 items-center">
            <img src={logo} alt="Logo" className="h-10 mr-2" />
            <span className="text-black text-lg font-bold">NBAForum</span>
          </div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search" className="border p-2 rounded-md" />
        </div>
        <div className="flex justify-between">
          <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md mr-4" onClick={handleCreatePost} >Create a Post</button>
          <div>
            <UserCircleIcon className="h-10 text-black" />
          </div>
        </div>
      </nav>
    </header>
  );
}

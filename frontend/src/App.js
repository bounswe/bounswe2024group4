import React from 'react';
import './App.css';
import logo from './logo.svg';
import { Bars3Icon } from '@heroicons/react/24/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'


// Navbar component
function Navbar() {
  return (
      <header className="bg-black py-2">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex justify-between">
            <div className="menu-icon">
              <Bars3Icon className="h-10 text-white" />
            </div>
            <div className="logo flex ml-4 items-center">
              <img src={logo} alt="Logo" className="h-10 mr-2" />
              <span className="text-white text-lg font-bold">NBAForum</span>
            </div>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search" className="border p-2 rounded-md" />
          </div>
          <div className="flex justify-between">
            <button className="bg-pink-500 text-white px-4 py-2 rounded-md mr-4">Create a Post</button>
            <div>
              <UserCircleIcon className="h-10 text-white" />
            </div>
          </div>
        </nav>
      </header>
  );
}

function App() {
  return (
    <div className= "bg-nba min-h-screen bg-top-left">
        <Navbar />
        <main className="container mx-auto mt-40">
          <div className="signup-form">
            <form className="bg-white p-6 rounded-md shadow-md w-1/2">
            <h1 className="text-3xl font-bold text-blue-500 mb-8">Welcome to NBA Forum!</h1>
              <input type="text" name="username" placeholder="Username" required className="border p-2 rounded-md mb-4 w-full" />
              <input type="email" name="email" placeholder="Email" required className="border p-2 rounded-md mb-4 w-full" />
              <input type="password" name="password" placeholder="Password" required className="border p-2 rounded-md mb-4 w-full" />
              <input type="password" name="confirm_password" placeholder="Confirm Password" required className="border p-2 rounded-md mb-4 w-full" />
              <button type="submit" className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md">SIGN UP</button>
            </form>
          </div>
        </main>
      </div>
  );
}

export default App;

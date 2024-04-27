import React from "react";
import logo from "../assets/logo.svg";
import "../pages/SignUpPrompt.js";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect, useRef } from "react";

// Navbar component
export function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreatePost = () => {
    // Navigate to SignUpFail component
    navigate("/sign-up-prompt");
  };

  const handleLogo = () => {
    // Navigate to main page
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white py-2 border border-slate-150">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex justify-between relative" ref={menuRef}>
          <div className="menu-icon cursor-pointer" onClick={toggleMenu}>
            <Bars3Icon className="h-10 text-black" />
          </div>
          <div
            className="logo flex ml-4 items-center cursor-pointer"
            onClick={handleLogo}
          >
            <img src={logo} alt="Logo" className="h-10 mr-2" />
            <span className="text-black text-lg font-bold cursor-pointer">
              NBAForum
            </span>
          </div>
          {isMenuOpen && (
            <div className="dropdown-menu absolute top-full left-0 bg-white border border-gray-200 rounded shadow-lg">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100">Option 1</li>
                <li className="px-4 py-2 hover:bg-gray-100">Option 2</li>
                <li className="px-4 py-2 hover:bg-gray-100">Option 3</li>
              </ul>
            </div>
          )}
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md mr-4"
            onClick={handleCreatePost}
          >
            Create a Post
          </button>

          <div
            className="dropdown-menu-container relative"
            ref={profileMenuRef}
          >
            {isProfileMenuOpen && (
              <div className="dropdown-menu absolute top-full right--5 bg-white border border-gray-200 rounded shadow-lg">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    Profile Option 1
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    Profile Option 2
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    Profile Option 3
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <UserCircleIcon
              className="h-10 text-black cursor-pointer"
              onClick={toggleProfileMenu}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

import React, { useContext } from "react";
import { FaSearch } from 'react-icons/fa';
import { Context } from "../globalContext/globalContext.js";
import axios from 'axios';
import { setLoggedIn } from "../components/Auth.js";
import { useNavigate } from "react-router-dom";  

const Topbar = () => {
  // This function will be called when the logout button is clicked
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const navigate = useNavigate();  

  const handleLogout = async () => {
    try {
      await axios.get(baseURL + "/log_out/");
      setLoggedIn("false");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between items-center">
      <div className="flex-1 flex justify-center items-center">
        <div className="relative">
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-black text-white p-2 rounded border-2 border-blue-500 shadow-lg transition-shadow duration-300 hover:shadow-blue-500 hover:shadow-lg hover:scale-105">
          Create Post
        </button>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white p-2 rounded border-2 border-red-700 shadow-lg transition-shadow duration-300 hover:shadow-red-500 hover:shadow-lg hover:scale-105"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Topbar;

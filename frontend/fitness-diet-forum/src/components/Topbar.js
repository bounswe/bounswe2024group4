import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Topbar = () => {
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
      <button className="bg-black text-white p-2 rounded border-2 border-blue-500 shadow-lg transition-shadow duration-300 hover:shadow-blue-500 hover:shadow-lg hover:scale-105">
        Create Post
      </button>
    </div>
  );
};

export default Topbar;






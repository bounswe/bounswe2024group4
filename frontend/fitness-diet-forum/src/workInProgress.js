import React from 'react';
import "./css/index.css";

const WorkInProgress = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600">Fitness and Diet Forum</h1>
        <h2 className="mt-4 text-2xl text-blue-500">Work in Progress</h2>
        <p className="mt-6 text-lg text-gray-700">
          WorkInProgress, please check another time.
        </p>
        <p className="mt-2 text-md text-gray-500">
          best forum about fitness and diet!
        </p>
        <div className="mt-8">
          <button className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
            Click
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress;

import React from 'react';
import '../css/index.css'; // Adjust this path if necessary

const Exercise = ({ exerciseName, sets, reps, imageUrl }) => {
    return (
        <div className="w-full max-w-xl mx-auto bg-blue-600 rounded-lg text-white p-4 shadow-lg flex items-center space-x-4">
            {/* Exercise Image */}
            <img
                src={imageUrl}
                alt={`${exerciseName} illustration`}
                className="w-16 h-16 object-cover rounded-full border-2 border-white"
            />

            {/* Exercise Details */}
            <div className="flex-1">
                <h2 className="text-2xl font-semibold">{exerciseName}</h2>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-normal">{sets} sets</span>
                    <span className="text-lg font-normal">{reps} reps</span>
                </div>
            </div>
        </div>
    );
};

export default Exercise;

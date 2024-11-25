import React, { useState } from 'react';
import '../css/index.css'; // Adjust this path if necessary

const Exercise = ({ exerciseName, sets, reps, instruction, equipment }) => {
    const [showFullInstruction, setShowFullInstruction] = useState(false);

    const toggleInstruction = () => {
        setShowFullInstruction(!showFullInstruction);
    };

    const formatString = (input) => {
        return input
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white p-6 shadow-xl space-y-4">
            {/* Exercise Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{exerciseName}</h2>
                <div className="text-right">
                    <p className="text-lg">
                        <span className="font-semibold">Sets:</span> {sets}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Reps:</span> {reps}
                    </p>
                </div>
            </div>

            {/* Instruction Section */}
            {instruction && (
                <div className="bg-white text-gray-800 rounded-lg p-4 shadow-inner">
                    <h3 className="text-xl font-semibold mb-2 text-blue-700">Instruction</h3>
                    <p className="text-lg leading-relaxed">
                        {showFullInstruction
                            ? instruction
                            : `${instruction.slice(0, 100)}...`}
                    </p>
                    <button
                        onClick={toggleInstruction}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        {showFullInstruction ? 'Show less' : 'Get more'}
                    </button>
                </div>
            )}

            {/* Equipment Section */}
            {equipment && (
                <div>
                    <h3 className="text-lg font-semibold text-blue-300">Equipment:</h3>
                    <p className="text-lg">{formatString(equipment)}</p>
                </div>
            )}
        </div>
    );
};

export default Exercise;

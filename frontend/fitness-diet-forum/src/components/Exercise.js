import React, { useState } from 'react';
import '../css/index.css'; // Adjust this path if necessary

const Exercise = ({ exerciseName, sets, reps, instruction, equipment }) => {
    const [showInstruction, setShowInstruction] = useState(false);

    const toggleVisibility = () => {
        setShowInstruction(!showInstruction); // Toggle visibility of the instruction
    };

    const formatString = (input) => {
        return input
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
    };

    return (
        <div className="w-full min-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white p-6 shadow-xl space-y-4">
            {/* Exercise Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{exerciseName}</h2> {/* Changed to text-2xl */}
            </div>

            <div>
                <p className="text-base"> {/* Changed to text-base */}
                    <span className="text-base font-semibold text-blue-300">Sets:</span> {sets}
                </p>
                <p className="text-base"> {/* Changed to text-base */}
                    <span className="text-base font-semibold text-blue-300">Reps:</span> {reps}
                </p>
            </div>

            {/* Equipment Section */}
            {equipment && (
                <div>
                    <h3 className="text-base font-semibold text-blue-300"> {/* Changed to text-base */}
                        Equipment:
                    </h3>
                    <p className="text-base">{formatString(equipment)}</p> {/* Changed to text-base */}
                </div>
            )}

            {/* Instruction Section */}
            {instruction && (
                <>
                    <h3 
                        onClick={toggleVisibility} // Make the header clickable to toggle the instruction section visibility
                        className="text-base text-blue-300 cursor-pointer"  // Changed to text-base
                    >
                        {showInstruction ? '' : 'Click here for instructions'}
                    </h3>
                    
                    {showInstruction && (
                        <div className="bg-white text-gray-800 rounded-lg p-4 shadow-inner">
                            <p className="text-base leading-relaxed"> {/* Changed to text-base */}
                                {instruction}
                            </p>
                            <button
                                onClick={toggleVisibility}
                                className="mt-3 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default Exercise;

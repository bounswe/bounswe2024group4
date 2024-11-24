import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes,faPlay } from "@fortawesome/free-solid-svg-icons";

const DayProgram = ({
  day,
  programs,
  availablePrograms,
  onAddProgram,
  onRemoveProgram,
  onStartExercise,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleAddClick = () => {
    setIsModalOpen(true); // Modal'ı aç
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Modal'ı kapat
    setSelectedProgram(null); // Seçimi sıfırla
  };

  const handleProgramSelect = (event) => {
    const programId = parseInt(event.target.value, 10);
    const selected = availablePrograms.find((program) => program.id === programId);
    setSelectedProgram(selected);
  };

  const handleAddToDay = () => {
    if (selectedProgram) {
      onAddProgram(day, selectedProgram);
      handleCloseModal(); // Modal'ı kapat
    }
  };

  const handleRemove = (programId) => {
    onRemoveProgram(day, programId);
  };

  return (
    <div>
      {programs.length > 0 ? (
        programs.map((program) => (
          <div key={program.id} className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{program.programName}</h3>
              <ul className="ml-4 list-disc">
                {program.exercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.exerciseName} ({exercise.sets} sets of {exercise.reps})
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="ml-4 text-red-500 hover:text-red-700"
              onClick={() => handleRemove(program.id)}
              title="Remove program"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No programs</p>
      )}

      {/* Add Program Button */}
      <button
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center justify-center w-10 h-10"
        onClick={handleAddClick}
        title="Add Program"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold text-white mb-4">Select a Program</h3>
            <select
              onChange={handleProgramSelect}
              value={selectedProgram?.id || ""}
              className="w-full bg-gray-700 text-white p-2 rounded mb-4"
            >
              <option value="" disabled>
                -- Choose a program --
              </option>
              {availablePrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleAddToDay}
              >
                Add
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Exercise Button */}
      <button
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center justify-center w-10 h-10"
        onClick={() => onStartExercise(day)}
        title="Start Exercise"
      >
        <FontAwesomeIcon icon={faPlay} />
      </button>
    </div>
  );
};

export default DayProgram;










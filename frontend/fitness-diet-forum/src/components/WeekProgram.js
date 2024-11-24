import React, { useState } from "react";
import DayProgram from "./DayProgram";
import TodaysExercises from "./TodaysExercises";

const WeekProgram = ({ programs }) => {
  const [weekPrograms, setWeekPrograms] = useState([]);
  const [currentDay, setCurrentDay] = useState(null); 
  const [currentDayPrograms, setCurrentDayPrograms] = useState([]); 

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddProgram = (day, programToAdd) => {
    setWeekPrograms((prevPrograms) => {
      const isDuplicate = prevPrograms.some(
        (program) => program.day === day && program.id === programToAdd.id
      );

      if (!isDuplicate) {
        return [...prevPrograms, { ...programToAdd, day }];
      }
      return prevPrograms;
    });
  };

  const handleRemoveProgram = (day, programId) => {
    setWeekPrograms((prevPrograms) =>
      prevPrograms.filter(
        (program) => !(program.day === day && program.id === programId)
      )
    );
  };

  const handleStartExercise = (day) => {
    const dayPrograms = weekPrograms.filter((program) => program.day === day);
    setCurrentDay(day);
    setCurrentDayPrograms(dayPrograms);
  };

  const handleEndExercise = () => {
    setCurrentDay(null);
    setCurrentDayPrograms([]);
  };

  const getAvailablePrograms = (day) => {
    const addedProgramIds = weekPrograms
      .filter((program) => program.day === day)
      .map((program) => program.id);

    return programs.filter((program) => !addedProgramIds.includes(program.id));
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-700 text-left">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="border border-gray-700 px-4 py-2 bg-gray-800 text-white"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {daysOfWeek.map((day) => (
                <td
                  key={day}
                  className="border border-gray-700 px-4 py-2 bg-gray-700 text-white"
                >
                  <DayProgram
                    day={day}
                    programs={weekPrograms.filter((p) => p.day === day)}
                    availablePrograms={getAvailablePrograms(day)}
                    onAddProgram={handleAddProgram}
                    onRemoveProgram={handleRemoveProgram}
                    onStartExercise={handleStartExercise}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Today's Exercises */}
      {currentDay && (
        <TodaysExercises
          day={currentDay}
          programs={currentDayPrograms}
          onEndExercise={handleEndExercise}
        />
      )}
    </div>
  );
};

export default WeekProgram;







import React, { useState, useContext } from "react";
import DayProgram from "./DayProgram";
import TodaysExercises from "./TodaysExercises";
import axios from 'axios';
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";

const WeekProgram = ({ programs }) => {
  const [weekPrograms, setWeekPrograms] = useState([]);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDayPrograms, setCurrentDayPrograms] = useState([]);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const csrf_token = localStorage.getItem("csrfToken");
  const username = localStorage.getItem("username");

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
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
      prevPrograms.filter((program) => !(program.day === day && program.id === programId))
    );
  };

  const handleStartExercise = (day) => {
    const dayPrograms = weekPrograms.filter((program) => program.day === day);
    setCurrentDay(day);
    setCurrentDayPrograms(dayPrograms);
  };

  const handleEndExercise = async () => {
    console.log(currentDayPrograms[0]);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
      },
    };
    const body = { currentDayPrograms };

    try {
      // Here we would normally send the data to a workout log endpoint.
      // const response = await axios.post(`${baseURL}/workout-log/`, body, config);
      console.log('Workout saved:', body);
    } catch (error) {
      console.error("Error saving workout log:", error);
    }

    setCurrentDay(null);
    setCurrentDayPrograms([]);
  };

  const saveWeeklyProgram = async () => {
    // Prepare the data in a format suitable for the backend
    const workoutsData = {};
    
    // Map the week programs to fit the backend structure
    weekPrograms.forEach((program) => {
      workoutsData[daysOfWeek.indexOf(program.day) + 1] = program.id;
    });
  
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
      },
    };
  
    try {
      // Send the data to the backend for program creation
      const response = await axios.post(`${baseURL}/create-program/`, {
        workouts: workoutsData, // Send the workouts data as a key-value object
        username: username,
      }, config);
  
      console.log("Program saved successfully:", response.data);
      // Optionally, handle success (e.g., display a success message)
    } catch (error) {
      console.error("Error saving program:", error);
      // Optionally, handle failure (e.g., display an error message)
    }
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
                <th key={day} className="border border-gray-700 px-4 py-2 bg-gray-800 text-white">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {daysOfWeek.map((day) => (
                <td key={day} className="border border-gray-700 px-4 py-2 bg-gray-700 text-white">
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

      {currentDay && (
        <TodaysExercises
          day={currentDay}
          programs={currentDayPrograms}
          onEndExercise={handleEndExercise}
        />
      )}

      {/* Save Button */}
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={saveWeeklyProgram}
        >
          Save Weekly Program
        </button>
      </div>
    </div>
  );
};

export default WeekProgram;

import React, { useState, useContext } from "react";
import DayProgram from "./DayProgram";
import TodaysExercises from "./TodaysExercises";
import axios from 'axios';
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";

const WeekProgram = ({ programs , bookmarkedPrograms}) => {
  const [weekPrograms, setWeekPrograms] = useState([]);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDayPrograms, setCurrentDayPrograms] = useState([]);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      'Authorization': 'Token ' + token
    }
  }

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

  const handleEndExercise = async (completedExercises) => {
    console.log(currentDayPrograms[0]);

    // Prepare exercises with their updated 'is_completed' status
    const updatedExercises = currentDayPrograms.map(program => ({
      ...program,
      exercises: program.exercises.map(exercise => ({
        ...exercise,
        is_completed: completedExercises.includes(exercise.name), // Set the completion status based on user interaction
      })),
    }));

    const body = {
      exercises: updatedExercises,
    };

    try {
      // Assuming you want to update the exercises' completion status and log the workout at the same time
      const response = await axios.post(
        `${baseURL}/workout-log/${currentDayPrograms[0].id}/`,
        body,
        config
      );
      console.log("Workout saved:", body);
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

  const getBookmarkedPrograms = (day) => {
    const addedProgramIds = weekPrograms
      .filter((program) => program.day === day)
      .map((program) => program.id);
    return bookmarkedPrograms.filter((program) => !addedProgramIds.includes(program.id));
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
                    bookmarkedPrograms={getBookmarkedPrograms(day)}
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

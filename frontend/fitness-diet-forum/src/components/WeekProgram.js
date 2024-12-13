import React, { useState, useContext, useEffect } from "react";
import DayProgram from "./DayProgram";
import TodaysExercises from "./TodaysExercises";
import axios from 'axios';
import '../css/index.css';
import { Context } from "../globalContext/globalContext.js";

const WeekProgram = ({ programs, bookmarkedPrograms }) => {
  const [weekPrograms, setWeekPrograms] = useState([]);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentDayPrograms, setCurrentDayPrograms] = useState([]);
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      'Authorization': 'Token ' + token,
    },
  };

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];

  // Fetch programs from backend when component loads
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        
        const response = await axios.get(`${baseURL}/get-programs/`, config);
        const programs = response.data;

        
        if (programs.length > 0) {
          const lastProgram = programs[programs.length - 1];

          
          const mappedWorkouts = lastProgram.workouts.map((workout) => ({
            day: workout.day, 
            id: workout.workout.workout_id, 
            workout_name: workout.workout.workout_name, 
            exercises: workout.workout.exercises, 
          }));

          
          setWeekPrograms(mappedWorkouts);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    fetchPrograms();
  }, [baseURL]);

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

    const updatedExercises = currentDayPrograms.map(program => ({
      ...program,
      exercises: program.exercises.map(exercise => ({
        ...exercise,
        is_completed: completedExercises.includes(exercise.name),
      })),
    }));

    const body = {
      workout_completed: true,
      exercises: updatedExercises,
      date : new Date().toISOString().split("T")[0]
    };

    try {
      console.log(currentDayPrograms[0].id,body);
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
    const workoutsData = {};

    weekPrograms.forEach((program) => {
      workoutsData[daysOfWeek.indexOf(program.day) ] = program.id;
    });
    console.log(weekPrograms)
    try {
      const response = await axios.post(`${baseURL}/create-program/`, {
        workouts: workoutsData,
        username: username,
      }, config);

      console.log("Program saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving program:", error);
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


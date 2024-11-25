import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import WeekProgram from "../components/WeekProgram";
import ExerciseProgramList from "./ExerciseProgramList";
import { Context } from "../globalContext/globalContext.js";

const Exercises = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("weekly"); // State to track the selected view
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const csrf_token = localStorage.getItem("csrfToken");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${baseURL}/get-workouts/?username=${username}`);
        console.log('get workout response', response);
        setPrograms(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user programs:", error);
        setError(error); // Set error if the request fails
      }
    };

    fetchPrograms();
  }, [baseURL, username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
      <div className="w-full flex justify-center mb-6">
        <button 
          className={`px-4 py-2 mx-2 ${view === "weekly" ? "bg-blue-500" : "bg-gray-600"}`} 
          onClick={() => setView("weekly")}
        >
          Weekly Program
        </button>
        <button 
          className={`px-4 py-2 mx-2 ${view === "myExercises" ? "bg-blue-500" : "bg-gray-600"}`} 
          onClick={() => setView("myExercises")}
        >
          My Exercises
        </button>
      </div>

      <div className="w-full">
        {view === "weekly" ? (
          <div className="p-8 bg-gray-800 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-6">Weekly Exercise Program</h1>
            <WeekProgram programs={programs} />
          </div>
        ) : (
          <ExerciseProgramList />
        )}
      </div>
    </div>
  );
};

export default Exercises;

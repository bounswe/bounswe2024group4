import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import WeekProgram from "../components/WeekProgram";
import ExerciseProgramList from "./ExerciseProgramList";
import { Context } from "../globalContext/globalContext.js";

const Exercises = () => {
  const [programs, setPrograms] = useState([]); // Backend'den alınacak programlar
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState(null); // Hata durumu
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const csrf_token = localStorage.getItem("csrfToken");
  const username = localStorage.getItem("username");

  // Backend'den programları al
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${baseURL}/get-workouts/?username=${username}`);
        console.log('get workout response', response);
        setPrograms(response.data);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching user programs:", error);
    }
    };

    fetchPrograms();
  }, []);

  

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
      <div className="w-full">
        <ExerciseProgramList />
      </div>
      <div className="p-8 bg-gray-800 text-white min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Weekly Exercise Program</h1>
        <WeekProgram programs={programs} />
      </div>
    </div>
  );
};

export default Exercises;


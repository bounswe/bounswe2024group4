import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import WeekProgram from "../components/WeekProgram";
import ExerciseProgramList from "./ExerciseProgramList";
import ExerciseProgram from "../components/ExerciseProgram";
import { Context } from "../globalContext/globalContext.js";

const Exercises = () => {
  const [programs, setPrograms] = useState([]);
  const [bookmarkedPrograms, setBookmarkedPrograms] = useState([]); // State for full bookmarked programs
  const [error, setError] = useState(null);
  const [view, setView] = useState("weekly"); // State to track the selected view
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${baseURL}/get-workouts/?username=${username}`);
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching user programs:", error);
        setError(error);
      }
    };

    const fetchBookmarkedPrograms = async () => {
      try {
        // Get bookmarked program IDs
        const response = await axios.get(`${baseURL}/get-bookmarked-workouts/`, {
          params: { username },
        });
        const bookmarkedIds = response.data.map((program) => program.id);

        // Fetch full details for each bookmarked program
        const bookmarkedDetails = await Promise.all(
          bookmarkedIds.map(async (id) => {
            const detailResponse = await axios.get(`${baseURL}/get-workout/${id}/`);
            return detailResponse.data;
          })
        );

        setBookmarkedPrograms(bookmarkedDetails);
      } catch (error) {
        console.error("Error fetching bookmarked programs:", error);
        setError(error);
      }
    };

    fetchPrograms();
    fetchBookmarkedPrograms();
  }, [baseURL, username]);

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-8">
      {/* Navigation Buttons */}
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
        <button 
          className={`px-4 py-2 mx-2 ${view === "bookmarked" ? "bg-blue-500" : "bg-gray-600"}`} 
          onClick={() => setView("bookmarked")}
        >
          Bookmarked Workouts
        </button>
      </div>

      {/* Conditional Rendering Based on View */}
      <div className="w-full">
        {view === "weekly" ? (
          <div className="p-8 bg-gray-800 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-6">Weekly Exercise Program</h1>
            <WeekProgram programs={programs} />
          </div>
        ) : view === "myExercises" ? (
          <ExerciseProgramList />
        ) : (
          <div className="p-8 bg-gray-800 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-6">Bookmarked Workouts</h1>
            {bookmarkedPrograms.length > 0 ? (
              <div className="h-96 overflow-y-scroll mb-4">
                {bookmarkedPrograms.map((workout) => (
                  <div key={workout.id} className="mb-4">
                    <ExerciseProgram
                      programName={workout.workout_name}
                      exercises={workout.exercises}
                      onDelete={() => {}}
                      isOwn={false}
                      programId={workout.id}
                      currentRating={workout.rating}
                      ratingCount={workout.rating_count}
                      showRating={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No bookmarked workouts found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;





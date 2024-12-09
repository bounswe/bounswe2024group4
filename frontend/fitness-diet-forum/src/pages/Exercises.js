import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import WeekProgram from "../components/WeekProgram";
import ExerciseProgramList from "./ExerciseProgramList";
import ExerciseProgram from "../components/ExerciseProgram";
import { Context } from "../globalContext/globalContext.js";

const Exercises = () => {
  const [programs, setPrograms] = useState([]);
  const [bookmarkedPrograms, setBookmarkedPrograms] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState("weekly");
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${baseURL}/get-workouts/?username=${username}`);
        setPrograms(response.data);
        setError(null); // Clear previous errors
      } catch (error) {
        console.error("Error fetching user programs:", error);
        setError(error);
      }
    };

    const fetchBookmarkedPrograms = async () => {
      try {
        const response = await axios.get(`${baseURL}/get-bookmarked-workouts/`, {
          params: { username },
        });
        const bookmarkedIds = response.data.map((program) => program.id);

        const bookmarkedDetails = await Promise.all(
          bookmarkedIds.map(async (id) => {
            const detailResponse = await axios.get(`${baseURL}/get-workout/${id}/`);
            return detailResponse.data;
          })
        );

        setBookmarkedPrograms(bookmarkedDetails);
        setError(null); // Clear previous errors
      } catch (error) {
        console.error("Error fetching bookmarked programs:", error);
        setError(error);
      }
    };

    // Fetch data based on the current view
    if (view === "weekly") {
      fetchPrograms();
      fetchBookmarkedPrograms();
    } else if (view === "bookmarked") {
      fetchBookmarkedPrograms();
    }
  }, [view, baseURL, username]);

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
            <WeekProgram programs={programs} bookmarkedPrograms={bookmarkedPrograms} />
          </div>
        ) : view === "myExercises" ? (
          <ExerciseProgramList />
        ) : (
          <div className="p-8 bg-gray-800 text-white min-h-screen">
            <h1 className="text-4xl font-bold mb-6">Bookmarked Workouts</h1>
            {bookmarkedPrograms.length > 0 ? (
              <div className="flex flex-wrap gap-8">
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






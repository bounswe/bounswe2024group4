import React, { useEffect, useState, useContext, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Context } from "../globalContext/globalContext.js";

const History = () => {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [selectedDateLogs, setSelectedDateLogs] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState({});
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const token = localStorage.getItem("token");

  // Memoize config so it's not recreated on every render
  const config = useMemo(() => ({
    headers: {
      Authorization: "Token " + token,
    },
  }), [token]);

  // Fetch workout logs once when the component mounts and whenever baseURL changes.
  // If baseURL is stable (doesn't change), this runs only once.
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      try {
        const response = await axios.get(`${baseURL}/workout-logs/`, config);
        setWorkoutLogs(response.data);
        console.log("Workout Logs fetched:", response.data);
      } catch (error) {
        console.error("Error fetching workout logs:", error);
      }
    };
    if (baseURL && token) {
      fetchWorkoutLogs();
    }
  }, [baseURL, token, config]); 
  // Include only what truly affects fetching. If baseURL and token never change, the effect runs once.

  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');
    const logsForDate = workoutLogs.filter((log) => log.date === formattedDate);
    setSelectedDateLogs(logsForDate);
  };

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      if (selectedDateLogs.length === 0) return;

      const workoutIds = [...new Set(selectedDateLogs.map((log) => log.workout.workout_id))];
      const idsToFetch = workoutIds.filter(id => !workoutDetails[id]);

      if (idsToFetch.length === 0) return;

      const newDetails = {};
      for (const id of idsToFetch) {
        try {
          const response = await axios.get(`${baseURL}/get-workout/${id}/`, config);
          newDetails[id] = response.data;
        } catch (error) {
          console.error(`Error fetching details for workout ${id}:`, error);
        }
      }

      setWorkoutDetails(prevDetails => ({ ...prevDetails, ...newDetails }));
    };

    // fetch details only when selectedDateLogs changes
    // Do not include workoutDetails in the dependency array to avoid infinite loops.
    if (baseURL && token) {
      fetchWorkoutDetails();
    }
  }, [selectedDateLogs, baseURL, token, config]);

  return (
    <div className="p-6 min-h-screen bg-[#1A1D21] text-white">
      <h2 className="text-xl font-bold mb-4">Workout History</h2>
      <div className="flex gap-4">
        <div className="w-1/3">
          <Calendar
            onChange={handleDateChange}
            className="dark-calendar"
            tileContent={({ date }) => {
              const formattedDate = date.toLocaleDateString('en-CA');
              const hasWorkout = workoutLogs.some((log) => log.date === formattedDate);
              return hasWorkout ? <span className="text-green-500">•</span> : null;
            }}
          />
        </div>
        <div className="w-2/3 bg-gray-800 text-white p-4 rounded overflow-auto" style={{ maxHeight: "70vh" }}>
          {selectedDateLogs.length > 0 ? (
            <div>
              <h3 className="text-lg font-bold mb-2">
                {selectedDateLogs[0].date}
              </h3>
              {selectedDateLogs.map((log) => {
                const workoutId = log.workout.workout_id;
                const details = workoutDetails[workoutId];
                return (
                  <div key={log.log_id} className="mb-4 p-4 bg-gray-700 rounded shadow">
                    <h4 className="text-md font-semibold mb-2">
                      {log.workout.workout_name}
                    </h4>
                    {details ? (
                      <div>
                        <p><strong>Created by:</strong> {details.created_by}</p>
                        
                        
                      </div>
                    ) : (
                      <p>Loading workout details...</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No workouts on this date.</p>
          )}
        </div>
      </div>
      <style jsx>{`
        /* Override Calendar default styles for a dark theme */
        .dark-calendar {
          background-color: #333;
          border-radius: 8px;
          color: #fff;
        }
        .dark-calendar .react-calendar__navigation button {
          color: #fff;
          background: #444;
        }
        .dark-calendar .react-calendar__tile {
          background: #444;
          border-radius: 4px;
          color: #fff;
        }
        .dark-calendar .react-calendar__tile:enabled:hover,
        .dark-calendar .react-calendar__tile:enabled:focus {
          background: #555;
          color: #fff;
        }
        .dark-calendar .react-calendar__tile--active {
          background: #666;
          color: #fff;
        }
        .dark-calendar .react-calendar__navigation button:disabled {
          background: #444;
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default History;




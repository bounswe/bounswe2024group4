import React, { useState, useContext, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { Context } from "../globalContext/globalContext.js";
import axios from "axios";
import CreatePostModal from "./CreatePostModal";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const globalContext = useContext(Context);
  const { baseURL } = globalContext;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = useMemo(
    () => ({
      headers: {
        Authorization: "Token " + token,
      },
    }),
    [token]
  );

  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(["all"]);
  const [muscles, setMuscles] = useState([]);
  const [calories, setCalories] = useState({ min: 0, max: 1000 });
  const [minProtein, setMinProtein] = useState(0);
  const [maxProtein, setMaxProtein] = useState(1000);
  const [minFat, setMinFat] = useState(0);
  const [maxFat, setMaxFat] = useState(1000);
  const [minCarbs, setMinCarbs] = useState(0);
  const [maxCarbs, setMaxCarbs] = useState(1000);
  const [minFiber, setMinFiber] = useState(0);
  const [maxFiber, setMaxFiber] = useState(1000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const formatString = (input) => {
    return input
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/log_out/`, null, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      localStorage.setItem("LoggedIn", "false");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${baseURL}/search/`, {
        params: {
          search: searchQuery,
          categories: categories.join(","),
          muscles: muscles.join(","), // Send selected muscles as a comma-separated string
          min_calories: calories.min,
          max_calories: calories.max,
          min_protein: minProtein,
          max_protein: maxProtein,
          min_fat: minFat,
          max_fat: maxFat,
          min_carbs: minCarbs,
          max_carbs: maxCarbs,
          min_fiber: minFiber,
          max_fiber: maxFiber,
        },
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      navigate("/search-results", { state: { results: response.data } });
    } catch (error) {
      console.error("Search failed:", error.response?.data?.error || "An error occurred.");
    }
  };

  const muscleOptions = [
    'abdominals',
    'biceps',
    'calves',
    'chest',
    'glutes',
    'hamstrings',
    'lats',
    'lower_back',
    'quadriceps',
    'traps',
    'triceps',
    'shoulders',
    'cardio'
  ];

  return (
    <div className="bg-black text-white p-4 flex flex-col gap-4">
      {/* Topbar main section */}
      <div className="flex justify-between items-center">
        {/* Search bar */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1">
            <FaSearch
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 pr-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 w-full"
            />
          </div>
          {/* Filter Modal Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)} // Open the filter modal
            className="bg-gray-700 text-white px-4 py-2 rounded border-2 border-gray-500 shadow-lg hover:bg-gray-600"
          >
            Filters
          </button>
        </div>

        {/* Other buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded border-2 border-blue-500 shadow-lg hover:shadow-blue-500"
          >
            Create Post
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded border-2 border-red-700 shadow-lg hover:shadow-red-500"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Filters</h2>

            {/* Categories filter */}
            <div className="mb-4">
              <label className="block font-medium">Categories</label>
              <div className="flex flex-wrap gap-2">
                {["users", "posts", "meals", "workouts", "all"].map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categories.includes(category)}
                      onChange={() =>
                        setCategories((prev) =>
                          prev.includes(category)
                            ? prev.filter((cat) => cat !== category)
                            : [...prev, category]
                        )
                      }
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Muscle group filter */}
            <div className="mb-4">
              <label className="block font-medium">Muscles</label>
              <div className="grid grid-cols-2 gap-4">
                {muscleOptions.map((muscle) => (
                  <label key={muscle} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={muscle}
                      checked={muscles.includes(muscle)}
                      onChange={() => {
                        if (muscles.includes(muscle)) {
                          setMuscles(muscles.filter((m) => m !== muscle)); // Unselect
                        } else {
                          setMuscles([...muscles, muscle]); // Select
                        }
                      }}
                      className="text-white"
                    />
                    {formatString(muscle)}
                  </label>
                ))}
              </div>
            </div>

            {/* Calorie range filter */}
            <div className="mb-4">
              <label className="block font-medium">Calories (kcal)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={calories.min}
                  onChange={(e) => setCalories({ ...calories, min: e.target.value })}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
                <input
                  type="number"
                  value={calories.max}
                  onChange={(e) => setCalories({ ...calories, max: e.target.value })}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            {/* Protein range filter */}
            <div className="mb-4">
              <label className="block font-medium">Protein (g)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minProtein}
                  onChange={(e) => setMinProtein(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
                <input
                  type="number"
                  value={maxProtein}
                  onChange={(e) => setMaxProtein(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            {/* Fat range filter */}
            <div className="mb-4">
              <label className="block font-medium">Fat (g)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minFat}
                  onChange={(e) => setMinFat(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
                <input
                  type="number"
                  value={maxFat}
                  onChange={(e) => setMaxFat(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            {/* Carbs range filter */}
            <div className="mb-4">
              <label className="block font-medium">Carbs (g)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minCarbs}
                  onChange={(e) => setMinCarbs(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
                <input
                  type="number"
                  value={maxCarbs}
                  onChange={(e) => setMaxCarbs(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            {/* Fiber range filter */}
            <div className="mb-4">
              <label className="block font-medium">Fiber (g)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minFiber}
                  onChange={(e) => setMinFiber(e.target.value)}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
                <input
                  type="number"
                  value={maxFiber}
                  onChange={(e) => setMaxFiber(e.target.value)}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsFilterModalOpen(false)} // Close modal without applying filters
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsFilterModalOpen(false);
                  handleSearch(); // Trigger search with filters
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CreatePostModal component */}
      <CreatePostModal isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Topbar;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Meal from './pages/Meal';
import './css/index.css';
import PostPage from "./pages/PostPage";
import './css/index.css'; // Ensure correct CSS path
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar'; 
import MealList from './pages/MealList';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-darkBackground"> {/* Dark background for entire app */}
        {/* Sidebar */}
        <Sidebar />

              {/* Button to navigate to Meals Page */}
              <div className="mt-4">
                <Link to="/meals">
                  <button className="bg-accent hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300">
                    Go to Meals Page
                  </button>
                </Link>
              </div>

              {/* Button to navigate to Posts Page */}
              <div className="mt-4">
                <Link to="/posts">
                  <button className="bg-accent hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300">
                    Go to Posts Page
                  </button>
                </Link>
              </div>
            </div>
          </div>
        } />


        {/* Meals Page Route */}
        <Route path="/meals" element={<Meal />} />

        {/* Posts Page Route */}
        <Route path="/posts" element={<PostPage />} />

        {/* Add other routes here as needed */}
      </Routes>
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <Topbar /> 

          {/* Main content */}
          <div className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="bg-primary flex flex-col justify-center items-center min-h-screen">
                    <div className="bg-secondary shadow-lg p-8 rounded-lg max-w-lg text-center">
                      <h1 className="text-4xl font-bold text-lightText mb-6">
                        Welcome to the Food App
                      </h1>

                      <div className="mt-4">
                        <Link to="/meals">
                          <button className="bg-accent hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300">
                            Go to Meals Page
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                }
              />

              <Route path="/meals" element={<MealList />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

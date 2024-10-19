import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Meal from './pages/Meal';
import './css/index.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar'; 

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

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
                      <h1 className="text-4xl font-bold text-white mb-6">
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

              <Route path="/meals" element={<Meal />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Meal from './pages/Meal';
import './css/index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={
          <div className="min-h-screen bg-primary flex flex-col justify-center items-center">
            <div className="bg-secondary shadow-lg p-8 rounded-lg max-w-lg text-center">
              <h1 className="text-4xl font-bold text-white mb-6">Welcome to the Food App</h1>

              {/* Button to navigate to Meals Page */}
              <div className="mt-4">
                <Link to="/meals">
                  <button className="bg-accent hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300">
                    Go to Meals Page
                  </button>
                </Link>
              </div>
            </div>
          </div>
        } />

        {/* Meals Page Route */}
        <Route path="/meals" element={<Meal />} />

        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
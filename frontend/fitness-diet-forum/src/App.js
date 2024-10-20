import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import PostPage from "./pages/PostPage";
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar'; 
import MealList from './pages/MealList';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-darkBackground"> {/* Dark background for entire app */}
        {/* Sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <Topbar /> 

          {/* Main content */}
          <div className="flex-1 p-8">
            <Routes>
              {/* Home Page Route: Display PostPage */}
              <Route path="/" element={<PostPage />} />

              {/* Meals Page Route */}
              <Route path="/meals" element={<MealList />} />

              {/* Posts Page Route */}
              <Route path="/posts" element={<PostPage />} />

              {/* Add other routes here as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

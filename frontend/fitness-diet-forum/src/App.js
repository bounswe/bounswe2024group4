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
      {/* Wrapper for sidebar and content */}
      <div className="flex bg-darkBackground">
        {/* Sidebar fixed to the left */}
        <Sidebar />

        {/* Main content area with margin to the right of the sidebar */}
        <div className="ml-64 flex-1">
          {/* Topbar */}
          <Topbar /> 

          {/* Main content */}
          <div className="p-8">
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

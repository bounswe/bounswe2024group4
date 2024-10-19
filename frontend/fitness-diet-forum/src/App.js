import './css/index.css';
import React from 'react';
import Meal from './pages/Meal'; // Import Meal component

function App() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Meal /> {/* Render the list of meals */}
    </div>
  );
}

export default App;

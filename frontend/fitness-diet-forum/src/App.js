import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import PostPage from "./pages/PostPage";
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar'; 
import MealList from './pages/MealList';
import Exercises from './pages/Exercises';
import ExerciseProgramList from './pages/ExerciseProgramList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import PublicLayout from './layouts/PublicLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (Login, Signup) */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicLayout>
              <Signup />
            </PublicLayout>
          }
        />

        {/* Protected Routes (Sidebar + Topbar) */}
        <Route
          path="/meals"
          element={
            <AuthenticatedLayout>
              <MealList />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/posts"
          element={
            <AuthenticatedLayout>
              <PostPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/exercise-programs"
          element={
            <AuthenticatedLayout>
              <ExerciseProgramList />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/exercises"
          element={
            <AuthenticatedLayout>
              <Exercises />
            </AuthenticatedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

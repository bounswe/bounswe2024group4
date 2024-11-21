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
import  PrivateRoute  from "./components/PrivateRoute";
import ProfilePage from './pages/ProfilePage';
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
      path="/login"
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
        <PrivateRoute>
          <AuthenticatedLayout>
            <MealList />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/posts"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <PostPage />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/exercise-programs"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <ExerciseProgramList />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/exercises"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <Exercises />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/profile/:username"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <ProfilePage />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
  </Routes>
</Router>
  );
}

export default App;

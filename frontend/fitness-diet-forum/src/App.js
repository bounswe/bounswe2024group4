import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import Feed from "./pages/Feed";
import Discover from "./pages/Discover";
import MealList from './pages/MealList';
import Exercises from './pages/Exercises';
import ExerciseProgramList from './pages/ExerciseProgramList';
import Login from './pages/Login';
import LeaderBoard from './pages/LeaderBoard';
import Signup from './pages/Signup';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import PublicLayout from './layouts/PublicLayout';
import PrivateRoute  from "./components/PrivateRoute";
import ProfilePage from './pages/ProfilePage';
import SearchResults from './pages/SearchResults';
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
      path="/feed"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <Feed />
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
    <Route
      path="/leaderboard"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <LeaderBoard />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/discover"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <Discover />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/search-results"
      element={
        <PrivateRoute>
          <AuthenticatedLayout>
            <SearchResults />
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
  </Routes>
</Router>
  );
}

export default App;

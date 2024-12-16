import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'; // Ensure you have axios-mock-adapter installed
import { useRouter } from 'expo-router';
import Leaderboard from '../app/(tabs)/leaderboard'; // Adjust path if necessary

// Mock axios for API requests
const mock = new MockAdapter(axios);

// Mock the useRouter hook from expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    query: {},
  })),
}));

describe('Leaderboard', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mock.reset();
    jest.clearAllMocks();
  });

  const mockLeaderboardData = {
    leaderboard: [
      { username: 'Alice', profile_picture: null, score: 95.0 },
      { username: 'Bob', profile_picture: null, score: 90.0 },
      { username: 'Charlie', profile_picture: null, score: 85.0 },
    ],
    workout_leaderboard: [
      { username: 'Alice', profile_picture: null, workout_rating: 50.0 },
      { username: 'Bob', profile_picture: null, workout_rating: 45.0 },
    ],
    meal_leaderboard: [
      { username: 'Charlie', profile_picture: null, meal_rating: 40.0 },
    ],
  };

  test('renders loading indicator initially', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Loading Leaderboard...')).toBeTruthy();
    expect(screen.getByTestId('ActivityIndicator')).toBeTruthy();
  });

  test('renders leaderboard data on successful fetch for combined tab', async () => {
    mock.onGet('http://localhost:8000/get_leaderboard/').reply(200, { leaderboard: mockLeaderboardData.leaderboard });

    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.queryByText('Loading Leaderboard...')).toBeNull();
      expect(screen.getByText('#1')).toBeTruthy();
      expect(screen.getByText('Alice')).toBeTruthy();
      expect(screen.getByText('95.0')).toBeTruthy();
    });
  });

  test('displays error message on fetch failure', async () => {
    mock.onGet('http://localhost:8000/get_leaderboard/').reply(500);

    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeTruthy();
    });
  });

  test('switches tabs correctly and fetches corresponding data', async () => {
    mock.onGet('http://localhost:8000/get_leaderboard/').reply(200, { leaderboard: mockLeaderboardData.leaderboard });
    mock.onGet('http://localhost:8000/get_workout_leaderboard/').reply(200, { workout_leaderboard: mockLeaderboardData.workout_leaderboard });
    mock.onGet('http://localhost:8000/get_meal_leaderboard/').reply(200, { meal_leaderboard: mockLeaderboardData.meal_leaderboard });

    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeTruthy();
      expect(screen.getByText('95.0')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Workout'));

    await waitFor(() => {
      expect(screen.queryByText('95.0')).toBeNull();
      expect(screen.getByText('50.0')).toBeTruthy();
      expect(screen.getByText('Alice')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Meal'));

    await waitFor(() => {
      expect(screen.queryByText('50.0')).toBeNull();
      expect(screen.getByText('Charlie')).toBeTruthy();
      expect(screen.getByText('40.0')).toBeTruthy();
    });
  });

  test('handles username click and navigates to profile', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<Leaderboard />);

    fireEvent.press(screen.getByText('Alice'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/others-profile',
        params: { viewingUser: undefined, viewedUser: 'Alice' },
      });
    });
  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import Leaderboard from '../app/(tabs)/leaderboard';

jest.mock('axios');

describe('Leaderboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockLeaderboardData = {
    leaderboard: [
      { username: 'Alice', profile_picture: null, rating: 95.0 },
      { username: 'Bob', profile_picture: null, rating: 90.0 },
      { username: 'Charlie', profile_picture: null, rating: 85.0 },
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
    const { getByText, getByTestId } = render(<Leaderboard />);
    expect(getByText('Loading Leaderboard...')).toBeTruthy();
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  test('renders leaderboard data on successful fetch', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: mockLeaderboardData,
    });

    const { getByText, queryByText } = render(<Leaderboard />);

    await waitFor(() => {
      expect(queryByText('Loading Leaderboard...')).toBeNull();
      expect(getByText('#1')).toBeTruthy();
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('95.0')).toBeTruthy();
    });
  });

  test('displays error message on fetch failure', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    const { getByText } = render(<Leaderboard />);

    await waitFor(() => {
      expect(getByText('Something went wrong. Please try again later.')).toBeTruthy();
    });
  });

  test('switches tabs correctly and fetches corresponding data', async () => {
    (axios.get as jest.Mock).mockImplementation((url) => {
      if (url.includes('/get_leaderboard/')) {
        return Promise.resolve({ status: 200, data: mockLeaderboardData });
      } else if (url.includes('/get_workout_leaderboard/')) {
        return Promise.resolve({
          status: 200,
          data: { workout_leaderboard: mockLeaderboardData.workout_leaderboard },
        });
      } else if (url.includes('/get_meal_leaderboard/')) {
        return Promise.resolve({
          status: 200,
          data: { meal_leaderboard: mockLeaderboardData.meal_leaderboard },
        });
      }
    });

    const { getByText, queryByText } = render(<Leaderboard />);

    await waitFor(() => {
      expect(queryByText('Alice')).toBeTruthy();
      expect(getByText('95.0')).toBeTruthy();
    });

    fireEvent.press(getByText('Workout'));

    await waitFor(() => {
      expect(queryByText('95.0')).toBeNull();
      expect(getByText('Workout')).toBeTruthy();
      expect(getByText('50.0')).toBeTruthy();
    });

    fireEvent.press(getByText('Meal'));

    await waitFor(() => {
      expect(queryByText('50.0')).toBeNull();
      expect(getByText('Charlie')).toBeTruthy();
      expect(getByText('40.0')).toBeTruthy();
    });
  });
});

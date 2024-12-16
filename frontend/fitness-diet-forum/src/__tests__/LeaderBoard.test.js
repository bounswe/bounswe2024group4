import { render, screen, waitFor, within } from '@testing-library/react';
import LeaderBoard from '../pages/LeaderBoard';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { Context } from '../globalContext/globalContext';

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: [] })
}));

describe('LeaderBoard', () => {
  const mockContextValue = {
    baseURL: 'http://localhost:5000',
  };

  beforeEach(() => {
    // Mock the localStorage
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Helper to wrap components with BrowserRouter and Context provider
  const renderWithContext = (ui) => {
    return render(
      <BrowserRouter>
        <Context.Provider value={mockContextValue}>
          {ui}
        </Context.Provider>
      </BrowserRouter>
    );
  };

  test('should render loading message when data is fetching', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: { leaderboard: [] } })
          .mockResolvedValueOnce({ status: 200, data: { workout_leaderboard: [] } })
          .mockResolvedValueOnce({ status: 200, data: { meal_leaderboard: [] } });

    renderWithContext(<LeaderBoard />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('should render error message when API fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));

    renderWithContext(<LeaderBoard />);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  test('should display leaderboards when data is fetched', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { leaderboard: [{ username: 'user1', rating: 4 }] },
    })
    .mockResolvedValueOnce({
      status: 200,
      data: { workout_leaderboard: [{ username: 'user2', workout_rating: 3 }] },
    })
    .mockResolvedValueOnce({
      status: 200,
      data: { meal_leaderboard: [{ username: 'user3', meal_rating: 5 }] },
    });

    renderWithContext(<LeaderBoard />);

    // Ensure the leaderboard sections render
    await waitFor(() => {
      expect(screen.getByText(/overall leaderboard/i)).toBeInTheDocument();
      expect(screen.getByText(/workout leaderboard/i)).toBeInTheDocument();
      expect(screen.getByText(/meal leaderboard/i)).toBeInTheDocument();

      // Check that the individual users are rendered
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('user3')).toBeInTheDocument();
    });
  });

  test('should render correct number of stars for valid ratings', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { leaderboard: [{ username: 'user1', rating: 4.5 }] },
    })
    .mockResolvedValueOnce({
      status: 200,
      data: { workout_leaderboard: [{ username: 'user2', workout_rating: 3.5 }] },
    })
    .mockResolvedValueOnce({
      status: 200,
      data: { meal_leaderboard: [{ username: 'user3', meal_rating: 2 }] },
    });
  
    renderWithContext(<LeaderBoard />);

    await waitFor(() => {
      const user2Item = screen.getByText('user2').closest('.user-item');

      expect(user2Item.querySelectorAll('.text-yellow-400')).toHaveLength(4);
      expect(user2Item.querySelector('.text-gray-400')).toBeInTheDocument();
    });
  });
  

  test('should not render stars for invalid ratings', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { leaderboard: [{ username: 'user1', rating: -1 }] },
    });

    renderWithContext(<LeaderBoard />);

    await waitFor(() => {
      // Check that stars are not rendered for invalid rating
      expect(screen.queryByText('★')).toBeNull();
      expect(screen.queryByText('☆')).toBeNull();
    });
  });
});

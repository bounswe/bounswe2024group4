import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import Feed from '../pages/Feed.js';
import { Context } from '../globalContext/globalContext.js';
import { BrowserRouter } from "react-router-dom";


jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ status: 200 })
}));

describe('Feed component', () => {
  const baseURL = 'http://localhost/';
  const loggedInUser = 'testuser';
  const token = 'mock-token';

  const mockPosts = [
    {
      id: 1,
      post_id: 101,
      user: {
        username: 'testuser1',
        score: 4.5
      },
      content: 'Test post content 1',
      meal_id: 1,
      workout_id: 1,
      like_count: 10,
      liked: false,
      created_at: '2024-12-15T12:00:00Z',
    },
    {
      id: 2,
      post_id: 102,
      user: {
        username: 'testuser2',
        score: 3.2
      },
      content: 'Test post content 2',
      meal_id: 2,
      workout_id: 2,
      like_count: 5,
      liked: true,
      created_at: '2024-12-15T12:00:00Z',
    },
  ];

  const mockContextValue = {
    baseURL,
  };

  beforeEach(() => {
    // Set up localStorage mock
    localStorage.setItem('username', loggedInUser);
    localStorage.setItem('token', token);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('renders posts successfully from API', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: { posts: mockPosts } });

    render(
        <BrowserRouter>
            <Context.Provider value={mockContextValue}>
                <Feed />
            </Context.Provider>
        </BrowserRouter>
    );

    await waitFor(() => {
      // Check if posts are rendered
      expect(screen.getByText('Feed')).toBeInTheDocument();
      expect(screen.getByText('Test post content 1')).toBeInTheDocument();
      expect(screen.getByText('Test post content 2')).toBeInTheDocument();
    });
  });

  test('displays an error message if fetching posts fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch posts'));

    render(
      <Context.Provider value={mockContextValue}>
        <Feed />
      </Context.Provider>
    );

    await waitFor(() => {
      // Check if the error message is shown
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  test('displays error message if server returns non-200 status', async () => {
    axios.get.mockResolvedValueOnce({ status: 500, data: {} });

    render(
      <Context.Provider value={mockContextValue}>
        <Feed />
      </Context.Provider>
    );

    await waitFor(() => {
      // Check if the error message is shown
      expect(screen.getByText('Failed to fetch posts')).toBeInTheDocument();
    });
  });

  test('displays "No posts found" when no posts are available', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: { posts: [] } });

    render(
      <Context.Provider value={mockContextValue}>
        <Feed />
      </Context.Provider>
    );

    await waitFor(() => {
      // Check if "No posts found" is shown
      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });
  });

  test('renders posts with correct data', async () => {
    axios.get.mockResolvedValueOnce({ status: 200, data: { posts: mockPosts } });

    render(
        <BrowserRouter>
            <Context.Provider value={mockContextValue}>
                <Feed />
            </Context.Provider>
        </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test post content 1')).toBeInTheDocument();
      expect(screen.getByText('Test post content 2')).toBeInTheDocument();
    });
  });
});

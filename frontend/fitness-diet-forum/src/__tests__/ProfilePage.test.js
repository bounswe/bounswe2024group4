import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage.js'
import axios from 'axios';
import { Context } from "../globalContext/globalContext.js";

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn()
}));

describe('ProfilePage', () => {
  const mockBaseURL = 'http://mockurl.com';
  const mockToken = 'mock-token';
  const contextValue = {
    baseURL: mockBaseURL
  };

  beforeEach(() => {
    global.localStorage.setItem('username', 'testuser');
    global.localStorage.setItem('token', mockToken);
  });

  test('should render profile information correctly', async () => {
    const mockResponse = {
        status: 200,
        data: {
          username: 'testuser',
          bio: 'This is a bio.',
          profile_picture: '/profile-pic.jpg',
          followers_count: 100,
          following_count: 50,
          score: 4.5,
          is_following: false,
          workouts: []
        }
      };
  
    axios.get.mockResolvedValue(mockResponse);
  
    render(
        <Context.Provider value={contextValue}>
            <ProfilePage username="testuser" />
        </Context.Provider>
    );
  
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('This is a bio.')).toBeInTheDocument(); // Adjust based on actual bio data
      expect(screen.getByText('100 Followers')).toBeInTheDocument(); // Adjust based on actual followers
    });
  });

  test('should show error message when user is not found', async () => {
    axios.get.mockResolvedValue({ status: 404 });

    render(
        <Context.Provider value={contextValue}>
            <ProfilePage username="nonexistentuser" />
        </Context.Provider>
    );

    await waitFor(() => {
        expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  test('should handle follow button click', async () => {
    const mockResponseFollow = {
      status: 200,
      data: {
        is_following: true,
        followers_count: 101
      }
    };
    axios.get.mockResolvedValue({
        status: 200,
        data: {
          username: 'testuser2',
          bio: 'This is a bio.',
          profile_picture: '/profile-pic.jpg',
          followers_count: 100,
          following_count: 50,
          score: 4.5,
          is_following: false,
          workouts: []
        }
    });
    axios.post.mockResolvedValue(mockResponseFollow);
    
    render(
        <Context.Provider value={contextValue}>
            <ProfilePage username="testuser2"/>
        </Context.Provider>
    );
    
    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(screen.getByText('Unfollow')).toBeInTheDocument();
      expect(screen.getByText('101 Followers')).toBeInTheDocument();
    });
  });

  test('should render stars based on score', async () => {  
    axios.get.mockResolvedValue({
        status: 200,
        data: {
          username: 'testuser2',
          bio: 'This is a bio.',
          profile_picture: '/profile-pic.jpg',
          followers_count: 100,
          following_count: 50,
          score: 4.5,
          is_following: false,
          posts: [{ post_id: 1, content: 'Post 1' }],
          workouts: [],
          user_type: "member"
        }
      });
    render(
        <Context.Provider value={contextValue}>
            <ProfilePage username="testuser2"/>
        </Context.Provider>
    );

    await waitFor(() => {
        const stars = screen.getAllByText('★');
        expect(stars).toHaveLength(5);  // 5 stars should be rendered
      });
  });
});

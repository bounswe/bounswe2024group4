import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PostFeed from '../app/(tabs)/index';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn()
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn()
}));

jest.mock('axios');

jest.mock('@expo/vector-icons', () => ({
  FontAwesome5: 'FontAwesome5'
}));

// Mock Post component
jest.mock('../components/Post', () => {
  return function MockPost(props) {
    return (
      <div data-testid="mock-post">
        <span>Post by {props.user}</span>
        <span>Content: {props.content}</span>
        <button 
          onClick={() => props.onLikeUpdate(props.postId, !props.liked, props.liked ? props.like_count - 1 : props.like_count + 1)}
        >
          Like
        </button>
      </div>
    );
  };
});

describe('PostFeed', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockPosts = [
    {
      post_id: 1,
      user: 'testUser',
      content: 'Test post content',
      meal_id: null,
      workout_id: null,
      like_count: 5,
      liked: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'username') return Promise.resolve('testUser');
      if (key === 'token') return Promise.resolve('testToken');
      return Promise.resolve(null);
    });
    axios.get.mockResolvedValue({ status: 200, data: { posts: mockPosts } });
  });

  test('renders loading state initially', () => {
    const { getByText } = render(<PostFeed />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  test('renders feed header', () => {
    const { getByText } = render(<PostFeed />);
    expect(getByText('Your Feed')).toBeTruthy();
  });

  test('loads and displays posts', async () => {
    const { findByText } = render(<PostFeed />);
    await waitFor(() => {
      expect(findByText('Post by testUser')).toBeTruthy();
    });
  });

  test('handles authentication error', async () => {
    AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));
    
    const { findByText } = render(<PostFeed />);
    await waitFor(() => {
      expect(findByText('Please log in to view your feed')).toBeTruthy();
    });
  });

  test('handles API error', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    
    const { findByText } = render(<PostFeed />);
    await waitFor(() => {
      expect(findByText('Something went wrong')).toBeTruthy();
    });
  });

  test('stops polling when component unmounts', async () => {
    jest.useFakeTimers();
    const { unmount } = render(<PostFeed />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });
});
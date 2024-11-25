import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import HomeScreen from '../app/index';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
  });

  test('renders correctly', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    expect(getByText('FITNESS AND DIET FORUM')).toBeTruthy();
    expect(getByText('Welcome!')).toBeTruthy();
    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByText('Sign up and join us!')).toBeTruthy();
  });

  test('navigates to login screen on Log In button press', () => {
    const { getByText } = render(<HomeScreen />);

    const loginButton = getByText('Log In');
    fireEvent.press(loginButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  test('navigates to signup screen on Sign Up button press', () => {
    const { getByText } = render(<HomeScreen />);

    const signupButton = getByText('Sign Up');
    fireEvent.press(signupButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/signup');
  });
});

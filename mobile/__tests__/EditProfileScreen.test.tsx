import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProfileScreen from '../app/EditProfileScreen';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mocked_image_uri' }],
    })
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      granted: true,
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
}));

describe('EditProfileScreen', () => {
  it('renders the component correctly', () => {
    const { getByText, getByPlaceholderText } = render(<EditProfileScreen />);
    expect(getByText('Edit Profile')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter new password')).toBeTruthy();
  });

  it('validates email format and shows an error message for invalid input', async () => {
    const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);
    const emailInput = getByPlaceholderText('Email');
    const saveButton = getByText('Save Changes');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Invalid email format.')).toBeTruthy();
    });
  });

  it('shows an error message when passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = render(<EditProfileScreen />);
    const passwordInput = getByPlaceholderText('Enter new password');
    const confirmPasswordInput = getByPlaceholderText('Confirm new password');
    const saveButton = getByText('Save Changes');

    fireEvent.changeText(passwordInput, 'Password123!');
    fireEvent.changeText(confirmPasswordInput, 'Different123!');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Passwords do not match.')).toBeTruthy();
    });
  });

  it('opens the image picker when "Change Photo" is pressed', async () => {
    const { getByText } = render(<EditProfileScreen />);
    const changePhotoButton = getByText('Change Photo');
    fireEvent.press(changePhotoButton);

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });
});

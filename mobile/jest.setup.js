jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
    isLoaded: jest.fn(() => true),
  }));
  
  jest.mock('@expo/vector-icons', () => ({
    Ionicons: {
      loadFont: jest.fn(),
    },
  }));
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  };
  
  jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => mockRouter),
  }));
  
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
  
  jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Icon',
  }));
  jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);


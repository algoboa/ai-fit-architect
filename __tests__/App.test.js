import React from 'react';
import { render } from '@testing-library/react-native';

// Mock all external dependencies before importing App
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    NavigationContainer: ({ children }) => React.createElement(View, null, children),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => React.createElement(View, null, children),
      Screen: () => null,
    }),
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => React.createElement(View, null, children),
      Screen: () => null,
    }),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Provider: ({ children }) => React.createElement(View, null, children),
    MD3DarkTheme: {},
  };
});

jest.mock('../src/store/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    userProfile: null,
    isLoading: false,
    initializeAuth: jest.fn(() => jest.fn()),
  }),
}));

jest.mock('../src/navigation/AuthNavigator', () => {
  return function MockAuthNavigator() {
    return null;
  };
});

jest.mock('../src/navigation/AppNavigator', () => {
  return function MockAppNavigator() {
    return null;
  };
});

import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeTruthy();
  });
});

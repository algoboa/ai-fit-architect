import React from 'react';
import { render } from '@testing-library/react-native';

// Mock react-native-paper components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');

  const Card = ({ children, style, testID }) =>
    React.createElement(View, { style, testID }, children);
  Card.Content = ({ children, style }) =>
    React.createElement(View, { style }, children);

  return {
    Provider: ({ children }) => React.createElement(View, null, children),
    Text: ({ children, style }) => React.createElement(Text, { style }, children),
    Card,
    Button: ({ children, onPress, mode, ...props }) =>
      React.createElement(
        TouchableOpacity,
        { onPress, ...props },
        React.createElement(Text, null, typeof children === 'string' ? children : '')
      ),
    ProgressBar: ({ progress, color, style, testID }) =>
      React.createElement(View, { testID, style }),
    MD3DarkTheme: {},
  };
});

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style, edges }) =>
      React.createElement(View, { style }, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// Mock the auth store
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: () => ({
    userProfile: { name: 'Test User' },
    logout: jest.fn(),
  }),
}));

// Import after mocks
import DashboardScreen from '../../src/screens/DashboardScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

const renderDashboard = () => {
  return render(<DashboardScreen navigation={mockNavigation} />);
};

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders main cards correctly', () => {
    const { getByTestId } = renderDashboard();

    expect(getByTestId('workout-card')).toBeTruthy();
    expect(getByTestId('nutrition-card')).toBeTruthy();
    expect(getByTestId('progress-card')).toBeTruthy();
    expect(getByTestId('chart-card')).toBeTruthy();
  });

  it('displays greeting with user name', () => {
    const { getByText } = renderDashboard();
    expect(getByText(/Test User/)).toBeTruthy();
  });

  it('displays workout information', () => {
    const { getByText } = renderDashboard();
    expect(getByText('Upper Body Strength')).toBeTruthy();
  });

  it('displays nutrition labels', () => {
    const { getByText } = renderDashboard();
    expect(getByText('Calories')).toBeTruthy();
    expect(getByText('Protein')).toBeTruthy();
  });
});

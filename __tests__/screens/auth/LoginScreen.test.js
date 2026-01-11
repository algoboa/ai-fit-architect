import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from '../../../src/screens/auth/LoginScreen';
import { useAuthStore } from '../../../src/store/authStore';
import { paperTheme } from '../../../src/theme';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock the auth store
jest.mock('../../../src/store/authStore');

const renderLoginScreen = () => {
  return render(
    <PaperProvider theme={paperTheme}>
      <LoginScreen navigation={mockNavigation} />
    </PaperProvider>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      signIn: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = renderLoginScreen();

    expect(getByText('AI-Fit Architect')).toBeTruthy();
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('shows validation error for empty email', async () => {
    const { getByTestId, getByText } = renderLoginScreen();

    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email', async () => {
    const { getByTestId, getByText } = renderLoginScreen();

    fireEvent.changeText(getByTestId('email-input'), 'invalid-email');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('shows validation error for empty password', async () => {
    const { getByTestId, getByText } = renderLoginScreen();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for short password', async () => {
    const { getByTestId, getByText } = renderLoginScreen();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), '12345');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('calls signIn with valid credentials', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({});
    useAuthStore.mockReturnValue({
      signIn: mockSignIn,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    });

    const { getByTestId } = renderLoginScreen();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('navigates to SignUp screen when link is pressed', () => {
    const { getByTestId } = renderLoginScreen();

    fireEvent.press(getByTestId('signup-link'));

    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });

  it('displays error from auth store', () => {
    useAuthStore.mockReturnValue({
      signIn: jest.fn(),
      isLoading: false,
      error: 'Invalid credentials',
      clearError: jest.fn(),
    });

    const { getByText } = renderLoginScreen();

    expect(getByText('Invalid credentials')).toBeTruthy();
  });
});

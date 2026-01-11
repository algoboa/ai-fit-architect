import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import SignUpScreen from '../../../src/screens/auth/SignUpScreen';
import { useAuthStore } from '../../../src/store/authStore';
import { paperTheme } from '../../../src/theme';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock the auth store
jest.mock('../../../src/store/authStore');

const renderSignUpScreen = () => {
  return render(
    <PaperProvider theme={paperTheme}>
      <SignUpScreen navigation={mockNavigation} />
    </PaperProvider>
  );
};

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      signUp: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = renderSignUpScreen();

    expect(getByText('AI-Fit Architect')).toBeTruthy();
    expect(getByText('Start your personalized fitness journey today')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('confirm-password-input')).toBeTruthy();
    expect(getByTestId('signup-button')).toBeTruthy();
  });

  it('shows validation error for empty email', async () => {
    const { getByTestId, getByText } = renderSignUpScreen();

    fireEvent.press(getByTestId('signup-button'));

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });

  it('shows validation error for weak password', async () => {
    const { getByTestId, getByText } = renderSignUpScreen();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'weak');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'weak');
    fireEvent.press(getByTestId('terms-checkbox'));
    fireEvent.press(getByTestId('signup-button'));

    await waitFor(() => {
      expect(getByText(/Password must be at least 8 characters/)).toBeTruthy();
    });
  });

  it('shows validation error for password mismatch', async () => {
    const { getByTestId, getByText } = renderSignUpScreen();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'Password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Different123');
    fireEvent.press(getByTestId('terms-checkbox'));
    fireEvent.press(getByTestId('signup-button'));

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('shows validation error when terms not accepted', async () => {
    const { getByTestId, getByText } = renderSignUpScreen();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'Password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Password123');
    fireEvent.press(getByTestId('signup-button'));

    await waitFor(() => {
      expect(getByText('You must accept the Terms of Service')).toBeTruthy();
    });
  });

  it('calls signUp with valid data and navigates to Onboarding', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({});
    useAuthStore.mockReturnValue({
      signUp: mockSignUp,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    });

    const { getByTestId } = renderSignUpScreen();

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'Password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'Password123');
    fireEvent.press(getByTestId('terms-checkbox'));
    fireEvent.press(getByTestId('signup-button'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'Password123');
      expect(mockNavigate).toHaveBeenCalledWith('Onboarding');
    });
  });

  it('navigates to Login screen when link is pressed', () => {
    const { getByTestId } = renderSignUpScreen();

    fireEvent.press(getByTestId('login-link'));

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Secure storage utility
// Note: For production, consider using expo-secure-store for sensitive data
// This implementation uses AsyncStorage with basic encryption awareness

const STORAGE_KEYS = {
  AUTH_TOKEN: '@ai_fit_auth_token',
  USER_PROFILE: '@ai_fit_user_profile',
  ONBOARDING_DATA: '@ai_fit_onboarding',
  APP_SETTINGS: '@ai_fit_settings',
};

// Sensitive fields that should never be logged
const SENSITIVE_FIELDS = ['password', 'token', 'apiKey', 'secret', 'credential'];

// Sanitize data before logging or error reporting
export const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;

  const sanitized = { ...data };

  Object.keys(sanitized).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some((field) => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });

  return sanitized;
};

// Token storage functions
export const TokenStorage = {
  async setAuthToken(token) {
    if (!token) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.warn('Failed to store auth token');
    }
  },

  async getAuthToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.warn('Failed to retrieve auth token');
      return null;
    }
  },

  async removeAuthToken() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.warn('Failed to remove auth token');
    }
  },
};

// User profile storage
export const ProfileStorage = {
  async setProfile(profile) {
    if (!profile) return;
    try {
      // Sanitize before storing
      const sanitizedProfile = sanitizeData(profile);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(sanitizedProfile)
      );
    } catch (error) {
      console.warn('Failed to store user profile');
    }
  },

  async getProfile() {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.warn('Failed to retrieve user profile');
      return null;
    }
  },

  async removeProfile() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      console.warn('Failed to remove user profile');
    }
  },
};

// Onboarding data storage
export const OnboardingStorage = {
  async setData(data) {
    if (!data) return;
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDING_DATA,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn('Failed to store onboarding data');
    }
  },

  async getData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to retrieve onboarding data');
      return null;
    }
  },

  async clearData() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
    } catch (error) {
      console.warn('Failed to clear onboarding data');
    }
  },
};

// App settings storage
export const SettingsStorage = {
  async setSettings(settings) {
    if (!settings) return;
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.APP_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.warn('Failed to store app settings');
    }
  },

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.warn('Failed to retrieve app settings');
      return null;
    }
  },
};

// Clear all stored data (for logout)
export const clearAllStorage = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE),
      AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA),
    ]);
  } catch (error) {
    console.warn('Failed to clear storage');
  }
};

export default {
  TokenStorage,
  ProfileStorage,
  OnboardingStorage,
  SettingsStorage,
  clearAllStorage,
  sanitizeData,
  STORAGE_KEYS,
};

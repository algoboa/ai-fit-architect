import { Platform } from 'react-native';

// Haptic feedback utility
// Note: expo-haptics requires installation: npx expo install expo-haptics

let Haptics = null;

// Lazy load Haptics to handle cases where it's not installed
const loadHaptics = async () => {
  if (Haptics !== null) return Haptics;

  try {
    Haptics = await import('expo-haptics');
    return Haptics;
  } catch (error) {
    // Haptics not available
    console.warn('expo-haptics not installed. Haptic feedback disabled.');
    Haptics = false;
    return false;
  }
};

// Check if haptics are available on this device
export const isHapticsAvailable = () => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

// Light haptic feedback - for subtle interactions
export const lightHaptic = async () => {
  if (!isHapticsAvailable()) return;

  const haptics = await loadHaptics();
  if (haptics && haptics.impactAsync) {
    try {
      await haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail
    }
  }
};

// Medium haptic feedback - for button presses
export const mediumHaptic = async () => {
  if (!isHapticsAvailable()) return;

  const haptics = await loadHaptics();
  if (haptics && haptics.impactAsync) {
    try {
      await haptics.impactAsync(haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently fail
    }
  }
};

// Heavy haptic feedback - for significant actions
export const heavyHaptic = async () => {
  if (!isHapticsAvailable()) return;

  const haptics = await loadHaptics();
  if (haptics && haptics.impactAsync) {
    try {
      await haptics.impactAsync(haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently fail
    }
  }
};

// Success haptic feedback - for successful completions
export const successHaptic = async () => {
  if (!isHapticsAvailable()) return;

  const haptics = await loadHaptics();
  if (haptics && haptics.notificationAsync) {
    try {
      await haptics.notificationAsync(haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail
    }
  }
};

// Warning haptic feedback - for warnings
export const warningHaptic = async () => {
  if (!isHapticsAvailable()) return;

  const haptics = await loadHaptics();
  if (haptics && haptics.notificationAsync) {
    try {
      await haptics.notificationAsync(haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Silently fail
    }
  }
};

// Error haptic feedback - for errors
export const errorHaptic = async () => {
  if (!isHapticsAvailable()) return;

  const haptics = await loadHaptics();
  if (haptics && haptics.notificationAsync) {
    try {
      await haptics.notificationAsync(haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Silently fail
    }
  }
};

// Selection haptic feedback - for selection changes
export const selectionHaptic = async () => {
  if (!isHapticsAvailable()) return;

  const haptics = await loadHaptics();
  if (haptics && haptics.selectionAsync) {
    try {
      await haptics.selectionAsync();
    } catch (error) {
      // Silently fail
    }
  }
};

// Custom haptic patterns
export const hapticPatterns = {
  // Complete a set during workout
  setComplete: async () => {
    await successHaptic();
  },

  // Complete workout
  workoutComplete: async () => {
    await heavyHaptic();
    setTimeout(() => successHaptic(), 100);
  },

  // Button press
  buttonPress: async () => {
    await lightHaptic();
  },

  // Toggle switch
  toggle: async () => {
    await selectionHaptic();
  },

  // Form validation error
  validationError: async () => {
    await errorHaptic();
  },

  // Save success
  saveSuccess: async () => {
    await successHaptic();
  },

  // Camera capture
  cameraCapture: async () => {
    await mediumHaptic();
  },

  // Timer countdown warning (last 3 seconds)
  timerWarning: async () => {
    await lightHaptic();
  },

  // Achievement unlocked
  achievementUnlocked: async () => {
    await heavyHaptic();
    setTimeout(() => successHaptic(), 150);
    setTimeout(() => successHaptic(), 300);
  },
};

export default {
  light: lightHaptic,
  medium: mediumHaptic,
  heavy: heavyHaptic,
  success: successHaptic,
  warning: warningHaptic,
  error: errorHaptic,
  selection: selectionHaptic,
  patterns: hapticPatterns,
};

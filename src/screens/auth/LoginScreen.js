import React, { useState, useCallback } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { hapticPatterns } from '../../utils/haptics';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signIn, isLoading, error, clearError } = useAuthStore();

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // onBlur validation for email
  const handleEmailBlur = useCallback(() => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hapticPatterns.validationError();
    }
  }, [email, validateEmail]);

  // onBlur validation for password
  const handlePasswordBlur = useCallback(() => {
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hapticPatterns.validationError();
    }
  }, [password]);

  const handleLogin = async () => {
    clearError();
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    try {
      await signIn(email, password);
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.appName}>AI-Fit Architect</Text>
          <Text style={styles.tagline}>Your Personal AI Fitness Coach</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>

          <TextInput
            testID="email-input"
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
              clearError();
            }}
            onBlur={handleEmailBlur}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={!!emailError}
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            accessible={true}
            accessibilityLabel="Email input field"
            accessibilityHint="Enter your email address"
          />
          {emailError ? (
            <HelperText type="error" visible={!!emailError}>
              {emailError}
            </HelperText>
          ) : null}

          <TextInput
            testID="password-input"
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
              clearError();
            }}
            onBlur={handlePasswordBlur}
            mode="outlined"
            secureTextEntry={!showPassword}
            error={!!passwordError}
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            accessible={true}
            accessibilityLabel="Password input field"
            accessibilityHint="Enter your password"
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color={colors.textSecondary}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              />
            }
          />
          {passwordError ? (
            <HelperText type="error" visible={!!passwordError}>
              {passwordError}
            </HelperText>
          ) : null}

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Button
            testID="login-button"
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            labelStyle={styles.buttonLabel}
            buttonColor={colors.primary}
            textColor={colors.background}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            labelStyle={styles.linkText}
            textColor={colors.primary}
          >
            Forgot Password?
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button
            testID="signup-link"
            mode="text"
            onPress={() => navigation.navigate('SignUp')}
            labelStyle={styles.signupLink}
            textColor={colors.primary}
          >
            Sign Up
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  appName: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    ...typography.button,
  },
  linkText: {
    ...typography.body2,
  },
  errorText: {
    ...typography.body2,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  signupLink: {
    ...typography.body2,
    fontWeight: '600',
  },
});

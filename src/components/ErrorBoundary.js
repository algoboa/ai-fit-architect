import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Navigate to home screen if navigation prop is available
    if (this.props.navigation) {
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = __DEV__ } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return fallback(this.state.error, this.handleRetry);
      }

      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>!</Text>
            </View>

            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              We apologize for the inconvenience. The app encountered an unexpected error.
            </Text>

            {showDetails && this.state.error && (
              <Card style={styles.errorCard}>
                <Card.Content>
                  <Text style={styles.errorTitle}>Error Details</Text>
                  <Text style={styles.errorMessage}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text style={styles.stackTrace}>
                      {this.state.errorInfo.componentStack?.slice(0, 500)}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={this.handleRetry}
                style={styles.button}
                buttonColor={colors.primary}
              >
                Try Again
              </Button>

              <Button
                mode="outlined"
                onPress={this.handleGoHome}
                style={styles.button}
                textColor={colors.text}
              >
                Go to Home
              </Button>
            </View>

            <Text style={styles.helpText}>
              If the problem persists, please restart the app or contact support.
            </Text>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easy use with hooks
export function withErrorBoundary(Component, fallback) {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Screen-level error boundary with navigation support
export function ScreenErrorBoundary({ children, navigation }) {
  return (
    <ErrorBoundary navigation={navigation}>
      {children}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...typography.body2,
    color: colors.error,
    fontFamily: 'monospace',
    marginBottom: spacing.sm,
  },
  stackTrace: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  button: {
    marginBottom: spacing.sm,
  },
  helpText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ErrorBoundary;

import { sanitizeData } from './secureStorage';

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Current log level (set to DEBUG in development, INFO in production)
const CURRENT_LOG_LEVEL = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

// Sensitive fields that should be redacted in logs
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /apikey/i,
  /secret/i,
  /credential/i,
  /authorization/i,
  /bearer/i,
];

// Check if a string contains sensitive data
const containsSensitiveData = (str) => {
  if (typeof str !== 'string') return false;
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(str));
};

// Format error for logging
const formatError = (error) => {
  if (!error) return 'Unknown error';

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      // Don't include stack trace in production
      ...__DEV__ && { stack: error.stack },
    };
  }

  return String(error);
};

// Format log message with timestamp
const formatMessage = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;

  if (data) {
    return `${prefix} ${message} ${JSON.stringify(sanitizeData(data))}`;
  }

  return `${prefix} ${message}`;
};

// Logger object
const logger = {
  // Debug level - only shown in development
  debug: (message, data) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log(formatMessage('DEBUG', message, data));
    }
  },

  // Info level - general information
  info: (message, data) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.log(formatMessage('INFO', message, data));
    }
  },

  // Warning level - potential issues
  warn: (message, data) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message, data));
    }
  },

  // Error level - actual errors
  error: (message, error, additionalData) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      const formattedError = formatError(error);
      const logData = {
        error: formattedError,
        ...(additionalData && { context: sanitizeData(additionalData) }),
      };

      console.error(formatMessage('ERROR', message, logData));

      // In production, you would send this to an error reporting service
      // Example: Sentry.captureException(error, { extra: sanitizeData(additionalData) });
    }
  },

  // API request logging
  api: {
    request: (method, url, data) => {
      if (__DEV__) {
        logger.debug(`API ${method} ${url}`, data);
      }
    },

    response: (method, url, status, data) => {
      if (__DEV__) {
        logger.debug(`API ${method} ${url} - ${status}`, data);
      }
    },

    error: (method, url, error) => {
      logger.error(`API ${method} ${url} failed`, error);
    },
  },

  // Analytics events (placeholder for future implementation)
  analytics: {
    event: (name, params) => {
      if (__DEV__) {
        logger.debug(`Analytics event: ${name}`, params);
      }
      // In production: analytics.logEvent(name, sanitizeData(params));
    },

    screen: (screenName) => {
      if (__DEV__) {
        logger.debug(`Screen view: ${screenName}`);
      }
      // In production: analytics.logScreenView(screenName);
    },
  },

  // Performance logging
  performance: {
    start: (label) => {
      if (__DEV__) {
        console.time(label);
      }
    },

    end: (label) => {
      if (__DEV__) {
        console.timeEnd(label);
      }
    },

    measure: (label, callback) => {
      const start = Date.now();
      const result = callback();
      const duration = Date.now() - start;

      if (__DEV__) {
        logger.debug(`${label} took ${duration}ms`);
      }

      return result;
    },
  },
};

// Export individual functions for convenience
export const { debug, info, warn, error } = logger;
export const logApi = logger.api;
export const logAnalytics = logger.analytics;
export const logPerformance = logger.performance;

export default logger;

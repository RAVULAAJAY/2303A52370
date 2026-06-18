import axios from 'axios';

const loggingEndpoint = import.meta.env.VITE_LOGGING_ENDPOINT;

export async function Log(stack, level, packageName, message) {
  if (!loggingEndpoint) {
    if (import.meta.env.DEV) {
      const method = level === 'error' || level === 'fatal' ? 'error' : 'log';
      console[method](`[${stack}] ${level} ${packageName}: ${message}`);
    }

    return;
  }

  try {
    await axios.post(loggingEndpoint, {
      stack,
      level,
      packageName,
      message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Logging request failed', error);
    }
  }
}
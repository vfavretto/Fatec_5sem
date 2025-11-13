import axios from 'axios';
import Constants from 'expo-constants';

function resolveBaseURL() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.expoGoConfig?.hostUri ||
    '';

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host) {
      return `http://${host}:3333`;
    }
  }

  return 'http://localhost:3333';
}

export const api = axios.create({
  baseURL: resolveBaseURL()
});


/**
 * API Configuration
 * Centralized configuration for backend API settings
 */

// Default to 0.0.0.0:8000 for development
// In production, this should be set via environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000/api/v1";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Health check endpoint for testing backend connectivity
export const healthCheckUrl = `${API_BASE_URL}/health`;

// Available endpoints
export const endpoints = {
  health: "/health",
  workout: "/workout",
  dailyNote: "/daily-note",
  studio: "/studio",
  voiceCommand: "/voice-command",
  automations: "/automations",
} as const;

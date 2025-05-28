/**
 * API service for Command Orchestra Backend
 * Handles all automation API calls
 */

import { apiConfig, endpoints } from "@/config/api";

const API_BASE_URL = apiConfig.baseUrl;

// Re-export apiConfig for use in other components
export { apiConfig };

export interface ApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  automation_type: string;
}

export interface HealthCheckResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface AutomationListResponse {
  available_automations: Record<
    string,
    {
      endpoint: string;
      method: string;
      description: string;
      supported_types?: string[];
      supported_actions?: string[];
      example: Record<string, string | boolean | number>;
    }
  >;
  timestamp: string;
  total_endpoints: number;
}

// Helper function to handle API requests with error handling
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout - check if backend is running");
    }
    throw error;
  }
}

// Health check
export const checkHealth = async (): Promise<HealthCheckResponse> => {
  return apiRequest<HealthCheckResponse>(`${API_BASE_URL}${endpoints.health}`);
};

// Workout automations
export const triggerWorkoutAutomation = async (
  workoutType: "running" | "cycling" | "mobility" | "gym",
  date?: string
): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>(`${API_BASE_URL}${endpoints.workout}`, {
    method: "POST",
    body: JSON.stringify({
      workout_type: workoutType,
      ...(date && { date }),
    }),
  });
};

// Daily note automations
export const triggerDailyNoteAutomation = async (
  noteType: "today" | "tomorrow",
  date?: string
): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>(`${API_BASE_URL}${endpoints.dailyNote}`, {
    method: "POST",
    body: JSON.stringify({
      note_type: noteType,
      ...(date && { date }),
    }),
  });
};

// Studio automations
export const triggerStudioAutomation = async (
  action: "open_session" | "switch_audio" | "open_project"
): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>(`${API_BASE_URL}${endpoints.studio}`, {
    method: "POST",
    body: JSON.stringify({
      action,
    }),
  });
};

// Voice command processing
export const processVoiceCommand = async (
  command: string,
  useAgent: boolean = false
): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>(`${API_BASE_URL}${endpoints.voiceCommand}`, {
    method: "POST",
    body: JSON.stringify({
      command,
      use_agent: useAgent,
    }),
  });
};

// List available automations
export const getAvailableAutomations =
  async (): Promise<AutomationListResponse> => {
    return apiRequest<AutomationListResponse>(
      `${API_BASE_URL}${endpoints.automations}`
    );
  };

// Generic automation trigger (fallback for custom commands)
export const triggerGenericAutomation = async (
  triggerId: string,
  triggerName: string,
  command?: string
): Promise<void> => {
  // For automations that don't have specific endpoints yet,
  // we can try to process them as voice commands
  if (command) {
    await processVoiceCommand(command, false);
  } else {
    // Or create a generic command based on the trigger
    const genericCommand = `trigger ${triggerName}`;
    await processVoiceCommand(genericCommand, false);
  }
};

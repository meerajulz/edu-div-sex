/**
 * Client-side error logging utility for monitoring app issues
 * Stores errors locally and sends to API endpoint for tracking
 */

interface ErrorLog {
  timestamp: string;
  type: 'video_error' | 'network_error' | 'component_error' | 'performance_warning';
  message: string;
  details?: Record<string, unknown>;
  userAgent: string;
  url: string;
  deviceInfo?: {
    platform: string;
    memory?: number;
    connection?: string;
  };
}

const MAX_LOCAL_LOGS = 50; // Keep last 50 errors in localStorage

/**
 * Get device information for debugging
 */
function getDeviceInfo() {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string };
  };

  return {
    platform: navigator.platform,
    memory: nav.deviceMemory,
    connection: nav.connection?.effectiveType,
  };
}

/**
 * Log an error to localStorage and optionally send to server
 */
export function logError(
  type: ErrorLog['type'],
  message: string,
  details?: Record<string, unknown>,
  sendToServer = true
) {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    type,
    message,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
    deviceInfo: getDeviceInfo(),
  };

  // Console log for development
  console.error(`[${type}] ${message}`, details);

  // Store in localStorage
  try {
    const existingLogs = getLocalErrors();
    existingLogs.push(errorLog);

    // Keep only last MAX_LOCAL_LOGS entries
    const recentLogs = existingLogs.slice(-MAX_LOCAL_LOGS);
    localStorage.setItem('app_error_logs', JSON.stringify(recentLogs));
  } catch (e) {
    console.error('Failed to store error in localStorage:', e);
  }

  // Send to server if enabled
  if (sendToServer) {
    sendErrorToServer(errorLog);
  }

  return errorLog;
}

/**
 * Send error to server API endpoint
 */
async function sendErrorToServer(errorLog: ErrorLog) {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorLog),
    });
  } catch (e) {
    // Silently fail - we don't want error logging to break the app
    console.warn('Failed to send error to server:', e);
  }
}

/**
 * Get all locally stored errors
 */
export function getLocalErrors(): ErrorLog[] {
  try {
    const logs = localStorage.getItem('app_error_logs');
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error('Failed to retrieve error logs:', e);
    return [];
  }
}

/**
 * Clear local error logs
 */
export function clearLocalErrors() {
  try {
    localStorage.removeItem('app_error_logs');
  } catch (e) {
    console.error('Failed to clear error logs:', e);
  }
}

/**
 * Log video-specific errors
 */
export function logVideoError(
  videoPath: string,
  error: MediaError | Error | string,
  additionalInfo?: Record<string, unknown>
) {
  const details: Record<string, unknown> = {
    videoPath,
    ...additionalInfo,
  };

  if (error instanceof MediaError) {
    details.code = error.code;
    details.mediaErrorMessage = error.message;
    details.errorType = getMediaErrorType(error.code);
  } else if (error instanceof Error) {
    details.errorMessage = error.message;
    details.stack = error.stack;
  } else {
    details.errorMessage = error;
  }

  logError('video_error', `Video loading failed: ${videoPath}`, details);
}

/**
 * Convert MediaError code to human-readable message
 */
function getMediaErrorType(code: number): string {
  switch (code) {
    case 1:
      return 'MEDIA_ERR_ABORTED - Fetching was aborted by user';
    case 2:
      return 'MEDIA_ERR_NETWORK - Network error occurred';
    case 3:
      return 'MEDIA_ERR_DECODE - Decoding error occurred';
    case 4:
      return 'MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported';
    default:
      return `Unknown error code: ${code}`;
  }
}

/**
 * Log performance warnings (e.g., slow loading times)
 */
export function logPerformanceWarning(
  action: string,
  duration: number,
  threshold: number,
  details?: Record<string, unknown>
) {
  if (duration > threshold) {
    logError(
      'performance_warning',
      `Slow ${action}: ${duration}ms (threshold: ${threshold}ms)`,
      { duration, threshold, ...details },
      false // Don't send performance warnings to server by default
    );
  }
}

/**
 * Export logs as downloadable file (for debugging with users)
 */
export function exportLogs() {
  const logs = getLocalErrors();
  const dataStr = JSON.stringify(logs, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `app-errors-${new Date().toISOString()}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  [key: string]: unknown;
}

function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

export function logInfo(message: string, context?: LogContext): void {
  const entry: LogEntry = {
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.log(formatLogEntry(entry));
}

export function logWarn(message: string, context?: LogContext): void {
  const entry: LogEntry = {
    level: 'warn',
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.warn(formatLogEntry(entry));
}

export function logError(message: string, error: Error, context?: LogContext): void {
  const entry: LogEntry = {
    level: 'error',
    message,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.error(formatLogEntry(entry));
}

export function logDebug(message: string, context?: LogContext): void {
  const entry: LogEntry = {
    level: 'debug',
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.debug(formatLogEntry(entry));
}


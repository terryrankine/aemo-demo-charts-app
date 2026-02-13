type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const IS_PROD = import.meta.env.PROD;
const ENV_LEVEL = (import.meta.env.VITE_LOG_LEVEL as LogLevel) ?? (IS_PROD ? 'info' : 'debug');

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[ENV_LEVEL];
}

function formatEntry(entry: LogEntry): void {
  if (IS_PROD) {
    // Structured JSON in production
    console[entry.level === 'debug' ? 'log' : entry.level](JSON.stringify(entry));
    return;
  }

  // Pretty output in development
  const prefix = `[${entry.level.toUpperCase()}]`;
  const ctx = entry.context ? entry.context : '';
  console[entry.level === 'debug' ? 'log' : entry.level](prefix, entry.message, ctx);
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (!shouldLog(level)) return;
  formatEntry({
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  });
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
};

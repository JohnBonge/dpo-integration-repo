type LogLevel = 'info' | 'warn' | 'error';

interface LogData {
  method?: string;
  url?: string;
  status?: number;
  duration?: number;
  error?: unknown;
  [key: string]: unknown;
}

export class Logger {
  private static formatMessage(
    level: LogLevel,
    message: string,
    data?: LogData
  ): string {
    const timestamp = new Date().toISOString();
    const dataString = data ? JSON.stringify(data, null, 2) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${dataString}`;
  }

  static info(message: string, data?: LogData) {
    console.log(this.formatMessage('info', message, data));
  }

  static warn(message: string, data?: LogData) {
    console.warn(this.formatMessage('warn', message, data));
  }

  static error(message: string, error?: unknown, data?: LogData) {
    console.error(
      this.formatMessage('error', message, {
        ...data,
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : error,
      })
    );
  }
}

// CHANGELOG: 2025-10-12 - Add generic retry helper for provider integrations
import { logError } from "@/lib/log";

export type RetryOptions = {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: unknown) => void;
};

export async function withRetry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    retries = 3,
    delayMs = 500,
    backoffFactor = 2,
    onRetry,
  } = options;

  let attempt = 0;
  let currentDelay = delayMs;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      onRetry?.(attempt + 1, error);
      logError("Retryable operation failed", error, { attempt: attempt + 1 });
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoffFactor;
      attempt += 1;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Retryable operation failed");
}

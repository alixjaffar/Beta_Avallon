// CHANGELOG: 2025-10-10 - Add error-first logging helper

type LogMeta = Record<string, unknown> | undefined;

export function logError(message: string, error?: unknown, meta?: LogMeta) {
  const payload = {
    level: 'error',
    message,
    error: normalizeError(error),
    ...meta,
  };
  console.error(JSON.stringify(payload));
}

export function logInfo(message: string, meta?: LogMeta) {
  const payload = { level: 'info', message, ...meta };
  console.log(JSON.stringify(payload));
}

function normalizeError(err: unknown) {
  if (!err) return undefined;
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return { message: String(err) };
}



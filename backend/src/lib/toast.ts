// CHANGELOG: 2024-12-19 - Add toast notification utilities
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

let toastId = 0;

export function createToast(
  type: ToastType,
  title: string,
  message?: string,
  duration = 5000
): Toast {
  return {
    id: `toast-${++toastId}`,
    type,
    title,
    message,
    duration,
  };
}

export function showSuccess(title: string, message?: string) {
  return createToast('success', title, message);
}

export function showError(title: string, message?: string) {
  return createToast('error', title, message);
}

export function showInfo(title: string, message?: string) {
  return createToast('info', title, message);
}

export function showWarning(title: string, message?: string) {
  return createToast('warning', title, message);
}

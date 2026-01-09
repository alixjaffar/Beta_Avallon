// Firebase Configuration for Avallon
import { initializeApp, type FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
  UserCredential,
  AuthError,
  type Auth
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChnRM8LC5cDkzUrWmyXjFB_7vBY8iw3jo",
  authDomain: "avallon-e0121.firebaseapp.com",
  projectId: "avallon-e0121",
  storageBucket: "avallon-e0121.firebasestorage.app",
  messagingSenderId: "728184381158",
  appId: "1:728184381158:web:8cf909d46e5cbb2553e527",
  measurementId: "G-L1E9R68X7T"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.error('Firebase initialization error:', e);
  // Create a minimal fallback
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// Analytics is completely disabled to avoid content blocker issues
// Can be re-enabled later if needed with dynamic import:
// const { getAnalytics } = await import('firebase/analytics');

// ==================== AUTH FUNCTIONS ====================

/**
 * Register a new user with email and password
 * - Creates Firebase user
 * - Sends email verification
 * - Updates display name
 */
export async function registerUser(
  email: string, 
  password: string, 
  displayName?: string
): Promise<{ user: User; error: null } | { user: null; error: string }> {
  try {
    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return { user: null, error: passwordError };
    }

    // Create the user
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Send email verification
    await sendEmailVerification(user);

    return { user, error: null };
  } catch (error) {
    const authError = error as AuthError;
    return { user: null, error: getErrorMessage(authError.code) };
  }
}

/**
 * Sign in user with email and password
 * - Verifies credentials with Firebase
 * - Returns Firebase ID token for backend verification
 */
export async function loginUser(
  email: string, 
  password: string
): Promise<{ user: User; token: string; error: null } | { user: null; token: null; error: string }> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the Firebase ID token for backend verification
    const token = await user.getIdToken();

    return { user, token, error: null };
  } catch (error) {
    const authError = error as AuthError;
    return { user: null, token: null, error: getErrorMessage(authError.code) };
  }
}

/**
 * Sign out the current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
  localStorage.removeItem('avallon_session');
  localStorage.removeItem('firebase_token');
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: getErrorMessage(authError.code) };
  }
}

/**
 * Get the current user's ID token for API calls
 * - Automatically refreshes if expired
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken(true); // Force refresh
  } catch {
    return null;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Resend email verification
 */
export async function resendVerificationEmail(): Promise<{ success: boolean; error: string | null }> {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: 'No user logged in' };
  }
  
  try {
    await sendEmailVerification(user);
    return { success: true, error: null };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: getErrorMessage(authError.code) };
  }
}

// ==================== SOCIAL AUTH ====================

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// GitHub Auth Provider  
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<{ user: User; token: string; error: null } | { user: null; token: null; error: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();
    
    console.log('Google Sign-in successful!', user.email);
    
    return { user, token, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Google sign-in error:', authError.code, authError.message);
    return { user: null, token: null, error: getErrorMessage(authError.code) };
  }
}

/**
 * Sign in with GitHub
 */
export async function signInWithGithub(): Promise<{ user: User; token: string; error: null } | { user: null; token: null; error: string }> {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    const token = await user.getIdToken();
    
    console.log('GitHub Sign-in successful!', user.email);
    
    return { user, token, error: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error('GitHub sign-in error:', authError.code, authError.message);
    return { user: null, token: null, error: getErrorMessage(authError.code) };
  }
}

// ==================== VALIDATION ====================

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*...)';
  }
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

// ==================== ERROR HANDLING ====================

/**
 * Convert Firebase error codes to user-friendly messages
 */
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in or use a different email.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this action.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for OAuth. Please contact support or use email/password sign-in.';
    default:
      console.error('Firebase Auth Error:', errorCode);
      return 'An error occurred. Please try again.';
  }
}

// Export auth instance for advanced use cases
export { auth, app };

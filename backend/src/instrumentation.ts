// Next.js instrumentation file - runs before any other code
// This ensures File API polyfill is loaded before undici tries to use it

// Import polyfill first - must be before any other imports
import './lib/polyfills/file-api';

export async function register() {
  // This runs in the Node.js environment before the server starts
  // The polyfill is already loaded by the import above
}

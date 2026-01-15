// Polyfill for File API in Node.js environment
// Required because undici (Node's fetch) references browser File API
// This must be imported before any modules that use fetch/axios

// Immediately set File on globalThis before any other code runs
if (typeof globalThis.File === 'undefined') {
  // Minimal File polyfill - just enough to prevent ReferenceError
  // undici checks for File existence but may not actually use it
  (globalThis as any).File = class File {
    name: string = '';
    size: number = 0;
    type: string = '';
    lastModified: number = Date.now();
    webkitRelativePath: string = '';
    
    constructor(
      _bits?: any,
      _name?: string,
      _options?: any
    ) {
      // Minimal implementation
    }
    
    async text(): Promise<string> { return ''; }
    async arrayBuffer(): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
    async blob(): Promise<Blob> { return new Blob(); }
    stream(): ReadableStream { return new ReadableStream(); }
    slice(): Blob { return new Blob(); }
  };
  
  // Also set on global for compatibility
  if (typeof global !== 'undefined') {
    (global as any).File = (globalThis as any).File;
  }
}

export {};

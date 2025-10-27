// CHANGELOG: 2025-10-10 - Add slug utility tests
import { describe, it, expect } from 'vitest';
import { slugify } from '@/lib/slug';

describe('slugify', () => {
  it('converts to lowercase and dashes', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes invalid characters and trims dashes', () => {
    expect(slugify('  **My__App!!  ')).toBe('my-app');
  });
});



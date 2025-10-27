// CHANGELOG: 2025-10-10 - Add Zod validation test for site creation
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const Body = z.object({ 
  name: z.string().min(2).max(100), 
  mode: z.enum(["lovable","template"]) 
});

describe('Site route validation', () => {
  it('parses valid input', () => {
    const parsed = Body.safeParse({ name: 'Test', mode: 'lovable' });
    expect(parsed.success).toBe(true);
  });

  it('fails on invalid input', () => {
    const parsed = Body.safeParse({ name: '', mode: 'invalid' });
    expect(parsed.success).toBe(false);
  });
});



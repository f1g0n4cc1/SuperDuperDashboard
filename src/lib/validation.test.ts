import { describe, it, expect } from 'vitest';
import { taskSchema } from './validation';

describe('taskSchema validation', () => {
  it('should validate a correct task input', () => {
    const input = { title: 'Test Task', priority: 2, category: 'Work' };
    const result = taskSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should fail if title is missing', () => {
    const input = { priority: 1 };
    const result = taskSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Title is required');
    }
  });

  it('should fail if title is too long', () => {
    const input = { title: 'a'.repeat(256) };
    const result = taskSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Title too long (max 255)');
    }
  });

  it('should fail if priority is out of range', () => {
    const input = { title: 'Valid Title', priority: 5 };
    const result = taskSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

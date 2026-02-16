import { z } from 'zod';

// Tasks Validation
export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long (max 255)"),
  priority: z.number().min(1).max(4).optional().default(1),
  category: z.string().max(50).optional().default('General'),
  project_id: z.string().uuid().optional().nullable(),
});

// Notes Validation
export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long (max 255)"),
  content: z.string().max(10000, "Note exceeds maximum length (10,000 chars)").optional().default(''),
  tags: z.array(z.string()).optional().default([]),
});

// Journal Validation
export const journalSchema = z.object({
  content: z.string().max(5000, "Journal entry too long (max 5,000 chars)").optional().default(''),
  mood: z.number().min(1).max(10).optional().default(5),
});

// Projects Validation
export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long (max 100)"),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(['active', 'completed', 'archived']).optional().default('active'),
});

// Habits Validation
export const habitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long (max 100)"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format").optional(),
  frequency: z.string().max(50).optional().default('daily'),
});

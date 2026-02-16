export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: number; // 1-10
  created_at: string;
}

export type CreateJournalInput = Pick<JournalEntry, 'content' | 'mood'>;
export type UpdateJournalInput = Partial<Pick<JournalEntry, 'content' | 'mood'>>;

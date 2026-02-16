export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  updated_at: string;
  created_at: string;
}

export type CreateNoteInput = Pick<Note, 'title' | 'content' | 'tags'>;
export type UpdateNoteInput = Partial<Pick<Note, 'title' | 'content' | 'tags'>>;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          external_id: string | null
          id: string
          is_external: boolean | null
          start_time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          external_id?: string | null
          id?: string
          is_external?: boolean | null
          start_time: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          external_id?: string | null
          id?: string
          is_external?: boolean | null
          start_time?: string
          title?: string
          user_id?: string
        }
      }
      goals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          user_id?: string
        }
      }
      habit_logs: {
        Row: {
          completed_at: string
          created_at: string
          habit_id: string
          id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          habit_id: string
          id?: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          habit_id?: string
          id?: string
        }
      }
      habits: {
        Row: {
          color: string | null
          created_at: string
          frequency: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          frequency?: string | null
          id?: string
          name: string
          user_id?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          frequency?: string | null
          id?: string
          name?: string
          user_id?: string
        }
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          id: string
          mood: number | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          mood?: number | null
          user_id?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          mood?: number | null
          user_id?: string
        }
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          tags: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          tags?: Json | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          tags?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          theme_pref: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          theme_pref?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          theme_pref?: string | null
          updated_at?: string | null
        }
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          user_id?: string
        }
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string
          id: string
          priority: number | null
          project_id: string | null
          status: string | null
          time_spent_seconds: number | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          priority?: number | null
          project_id?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          title: string
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          priority?: number | null
          project_id?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          title?: string
          user_id?: string
        }
      }
      user_settings: {
        Row: {
          dashboard_layout: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          dashboard_layout?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          dashboard_layout?: Json | null
          updated_at?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      project_summaries: {
        Row: {
          completed_tasks: number | null
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          progress: number | null
          status: string | null
          total_tasks: number | null
          user_id: string | null
        }
      }
    }
    Functions: {
      get_habit_stats: {
        Args: {
          target_habit_id: string
        }
        Returns: {
          habit_id: string
          current_streak: number
          total_completions: number
          last_completed_at: string
        }[]
      }
      get_or_create_daily_journal: {
        Args: Record<PropertyKey, never>
        Returns: {
          content: string | null
          created_at: string
          id: string
          mood: number | null
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

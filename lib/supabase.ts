import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'todo-app-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_complete: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: Todo;
        Insert: Omit<Todo, 'id' | 'created_at'>;
        Update: Partial<Omit<Todo, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
}
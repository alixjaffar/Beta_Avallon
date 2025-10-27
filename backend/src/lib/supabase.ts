import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Database {
  public: {
    Tables: {
      sites: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          status: 'draft' | 'deployed';
          preview_url: string | null;
          repo_url: string | null;
          created_at: string;
          updated_at: string;
          chat_history: any[] | null;
          website_content: any | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          status?: 'draft' | 'deployed';
          preview_url?: string | null;
          repo_url?: string | null;
          created_at?: string;
          updated_at?: string;
          chat_history?: any[] | null;
          website_content?: any | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
          status?: 'draft' | 'deployed';
          preview_url?: string | null;
          repo_url?: string | null;
          created_at?: string;
          updated_at?: string;
          chat_history?: any[] | null;
          website_content?: any | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

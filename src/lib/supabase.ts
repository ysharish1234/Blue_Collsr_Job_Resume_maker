import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  personal_info: {
    name: string;
    phone: string;
    email: string;
    address: string;
    languages: string[];
  };
  experience: Array<{
    type: string;
    title: string;
    company: string;
    duration: string;
    duties: string;
    tools: string;
  }>;
  skills: string[];
  education: string[];
  created_at: string;
  updated_at: string;
}
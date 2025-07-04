import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfkebxyfgdxrscxzedlm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlma2VieHlmZ2R4cnNjeHplZGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzY3MjksImV4cCI6MjA2NjU1MjcyOX0.W2-b6v08l1ew-qkuCzIp9GatbfZh4TxOrbPaaSLgsi8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
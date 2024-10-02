import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-ref.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'public-anon-key'; // Replace with your public API key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

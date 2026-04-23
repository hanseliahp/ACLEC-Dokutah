// public/supabase-client.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key

window.supabaseClient = createClient(supabaseUrl, supabaseKey);
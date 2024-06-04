import { createClient } from '@supabase/supabase-js';
import { SB_PROJECT_URL, SB_ANON_KEY } from "$env/static/private";

export const supabase = createClient(SB_PROJECT_URL, SB_ANON_KEY);
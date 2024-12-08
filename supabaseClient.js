import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://votre-url-projet.supabase.co';  // Remplacez par votre URL Supabase
const SUPABASE_KEY = 'votre-cle-publique-anon';                // Remplacez par votre clé anonyme fournie par Supabase

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://jzkxoxacfedtovlcvcfo.supabase.co';  // Remplacez par votre URL Supabase
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6a3hveGFjZmVkdG92bGN2Y2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2ODAwNzMsImV4cCI6MjA0OTI1NjA3M30.GV6N3HFuCLTjBrkorptrk2_dSwXEw80RKeYJEh9AZb4';                // Remplacez par votre clé anonyme fournie par Supabase

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

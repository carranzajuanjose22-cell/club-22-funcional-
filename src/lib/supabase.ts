import { createClient } from '@supabase/supabase-js';

// Estas son las llaves que conectan tu código con tu base de datos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las variables de entorno de Supabase. Verifica tu archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
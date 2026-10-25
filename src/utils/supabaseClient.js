import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const clave =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !clave) {
  console.error(
    "Faltan las claves de Supabase: revisa el archivo .env y reinicia npm run dev"
  );
}

export const supabase = createClient(url, clave);
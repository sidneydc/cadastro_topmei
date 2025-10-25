import { createClient } from '@supabase/supabase-js'

// Substitua com as suas credenciais do Supabase. 
// Para segurança, estas chaves devem ser lidas de variáveis de ambiente (.env)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO: As variáveis de ambiente REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY devem ser definidas no arquivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


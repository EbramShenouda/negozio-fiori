const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

/**
 * Client Supabase con service-role key.
 * Bypassa RLS → usare SOLO nel backend, mai esporre al frontend.
 * Esportato con lo stesso nome ("db") per compatibilità con i model esistenti.
 */
const db = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
});

console.log('✅ Supabase client inizializzato.');

module.exports = db;

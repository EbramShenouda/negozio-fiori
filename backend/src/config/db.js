const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    realtime: {
      enabled: false
    },
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

module.exports = supabase;
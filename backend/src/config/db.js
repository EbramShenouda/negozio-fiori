const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 0
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    db: {
      schema: 'public'
    }
  }
);

// ❌ IMPORTANTE: disabilita socket runtime (hack necessario su Node 20)
if (supabase.realtime) {
  supabase.realtime.disconnect?.();
}

module.exports = supabase;
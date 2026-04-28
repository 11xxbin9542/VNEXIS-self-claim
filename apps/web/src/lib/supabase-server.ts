import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// 서버 전용 — 클라이언트 번들에 포함되면 안 됨
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

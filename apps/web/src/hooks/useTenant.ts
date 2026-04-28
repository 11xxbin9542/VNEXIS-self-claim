'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tenant, User } from '@/lib/database.types';

interface TenantContext {
  tenant: Tenant | null;
  user: User | null;
  loading: boolean;
}

export function useTenant(): TenantContext {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from('users')
        .select('*, tenants(*)')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        const { tenants: tenantData, ...userProfile } = profile as User & { tenants: Tenant };
        setUser(userProfile);
        setTenant(tenantData ?? null);
      }

      setLoading(false);
    }

    load();
  }, []);

  return { tenant, user, loading };
}

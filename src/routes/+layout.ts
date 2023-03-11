import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { invalidate } from '$app/navigation';
import type { Database } from '$lib/types/supabase';

export async function load({ fetch, data, depends }) {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session,
		onAuthStateChange(event) {
			if (event !== 'SIGNED_IN') {
				invalidate('supabase:auth');
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
}

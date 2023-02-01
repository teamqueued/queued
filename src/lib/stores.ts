import { writable } from 'svelte/store';
import type { Database } from './api/supabase.types';
import type { TrackObject } from './api/spotify';
import { pusher_client } from './api/pusher/client';

type Queue = Database['public']['Tables']['queues']['Row'];

export interface QueueStore extends Pick<Queue, 'name' | 'id'> {
	tracks: Array<TrackObject & { db_id: number; votes: { up: number; down: number } }>;
}

export const createQueueStore = async (initial_value: QueueStore) => {
	const channel = pusher_client.subscribe(`queue-${initial_value.id}`);

	channel.bind('track-added', (data: TrackObject) => {
		// TODO: use real db id
		update((value) => ({ ...value, tracks: [...value.tracks, { ...data, db_id: 1, votes: { up: 0, down: 0 } }] }));
	});

	const { subscribe, update } = writable<QueueStore>(initial_value, () => {
		return () => channel.unbind('track-added');
	});

	return { subscribe };
};

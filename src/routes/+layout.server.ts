export async function load({ locals }) {
	return {
		session: await locals.get_session()
	};
}

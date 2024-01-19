export const handleFetch = async ({ event, request, fetch }) => {
	const { locals } = event;

	if (request.url.startsWith('http://localhost:5555')) {
		if (locals.token) {
			// request.headers.set('Authorization', `Bearer ${locals.token}`);
		}
	}
	
	return fetch(request);
};

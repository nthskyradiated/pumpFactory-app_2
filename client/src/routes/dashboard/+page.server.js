export async function load ({ cookies }) {

	return cookies.get('refreshToken');
	
}
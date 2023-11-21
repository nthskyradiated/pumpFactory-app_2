import { refreshToken } from '../../lib/auth';
export async function load ({ cookies }) {

	cookies.set( refreshToken, { path: '/' });
	
}
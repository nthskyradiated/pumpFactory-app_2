// src/hooks/authGuard.js
import { auth } from '$lib/auth'; // Adjust the path accordingly
import { Client, cacheExchange, fetchExchange, mapExchange, getContextClient, setContextClient } from '@urql/svelte';


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {

	const refreshTokenValue = event.cookies.get('refreshToken');
	const tokenValue = event.cookies.get('token');
	event.locals.isAdmin  = event.cookies.get('isAdmin');

  const client = new Client({
    
		exchanges: [
		  mapExchange({
			onError(error) {
			  console.error(error);
	
			},
		  }),
		  cacheExchange,
		  fetchExchange,
		],
		url: 'http://localhost:5555', // Update with your GraphQL server URL

		fetchOptions: () => {
		  
			// Log the values for verification
			console.log('from hooks Dashboard Token:', refreshTokenValue);
			console.log('from hooks Token:', tokenValue);
			return {
				tokenValue,
				refreshToken: refreshTokenValue,
			}
		}, requestPolicy: 'cache-and-network',
		credentials: 'include',
	}
	);

	if (tokenValue || refreshTokenValue) {
		if (event.url.pathname.startsWith('/waiver') && event.locals.isAdmin === 'false') {		
			return new Response('🍌')
		
			
		}
	}
	const response = await resolve(event);
  
	return response;
	  }
	
	
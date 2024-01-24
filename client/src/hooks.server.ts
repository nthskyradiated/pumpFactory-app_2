import { Client, mapExchange, cacheExchange, fetchExchange } from '@urql/svelte';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const token = event.cookies.get('token');
  const refreshToken = event.cookies.get('refreshToken');
  const isAdmin = event.cookies.get('isAdmin');
  event.locals.urqlClient = new Client({
    exchanges: [
      mapExchange({
        onError(error) {
          console.error(error);
        },
      }),
      cacheExchange,
      fetchExchange,
    ],
    url: 'http://localhost:5555',
    fetchOptions: () => {
      return {
        headers: {
          Cookie: `token=${token}`
        },
          credentials: 'include',
      }

      }
    

  })
  console.log(event);
  if (event.url.pathname.includes('/waiver') && !isAdmin) {		
    return new Response('🍌')
  }
const response = await resolve(event);	
return response;
}
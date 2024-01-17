// src/hooks/authGuard.js
import { auth } from '$lib/auth'; // Adjust the path accordingly

// export async function authGuard({ params, query, state }) {
//   const { isLoggedIn, isAdmin } = $auth;

//   // Check conditions for accessing the route
//   if (!isLoggedIn || !isAdmin) {
//     // Redirect to the login page or show an unauthorized page
//     return {
//       status: 403, // HTTP status code for forbidden
//       redirect: '/', // Redirect to the login page
//     };
//   }

//   // Allow access to the route
//   return {};
// }

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {	
  console.log(event);
  if (event.url.pathname.startsWith('/waiver') && !auth.isLoggedIn) {		
    return new Response('🍌')
  }
const response = await resolve(event);	
return response;
}
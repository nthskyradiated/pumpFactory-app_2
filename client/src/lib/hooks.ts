// src/hooks/authGuard.js
import { auth } from '$lib/auth'; // Adjust the path accordingly

export async function authGuard({ params, query, state }) {
  const { isLoggedIn, isAdmin } = $auth;

  // Check conditions for accessing the route
  if (!isLoggedIn || !isAdmin) {
    // Redirect to the login page or show an unauthorized page
    return {
      status: 403, // HTTP status code for forbidden
      redirect: '/', // Redirect to the login page
    };
  }

  // Allow access to the route
  return {};
}

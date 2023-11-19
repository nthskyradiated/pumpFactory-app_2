// auth.js (Sample auth module)
import { writable } from 'svelte/store';

// Read the isAdmin value from localStorage on initialization
// const initialIsAdmin = localStorage.getItem('isAdmin') === 'true';

export const auth = writable({
  isLoggedIn: false,
  isAdmin: false,
});

// // Subscribe to changes in the isAdmin store and update localStorage accordingly
// auth.subscribe(($auth) => {
//   localStorage.setItem('isAdmin', $auth.isAdmin);
// });

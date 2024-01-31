// auth.js (Sample auth module)
import { writable } from 'svelte/store';
import { browser } from '$app/environment';


let initialIsAdmin;
if (browser) {
initialIsAdmin = localStorage.getItem('isAdmin') === 'true' || false;
}

export const auth = writable({
  isLoggedIn: false,
  isAdmin: initialIsAdmin,
});

if (browser) {
  auth.subscribe(($auth) => {
    localStorage.setItem('isAdmin', $auth.isAdmin);
  }
  );
}// // Subscribe to changes in the isAdmin store and update localStorage accordingly

export const refreshToken = writable({
  refreshToken: null
})
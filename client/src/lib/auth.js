// auth.js (Sample auth module)
import { writable } from 'svelte/store';

export const auth = writable({
  isLoggedIn: false,
  user: null,
  // ... other properties ...
});

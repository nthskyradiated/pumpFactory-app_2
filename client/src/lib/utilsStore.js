import { writable } from 'svelte/store';

export const tabSet = writable(0);
export const deleteDocumentStore = writable(null);
export const deleteAttendanceStore = writable(null);

export const getInitials = (name) => {
    const nameArray = name.split(' ');
    if (nameArray.length === 1) {
      // If there is only one word in the name, return the first two characters
      return nameArray[0].substring(0, 2).toUpperCase();
    } else {
      // If there are multiple words in the name, return the first character of each word
      return nameArray.map(word => word[0].toUpperCase()).join('');
    }
  }
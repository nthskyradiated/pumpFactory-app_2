import { Client, cacheExchange, fetchExchange, mapExchange } from '@urql/svelte';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
};
  
const getCookie = (name) => {
  if (typeof document !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  return '';
};

export const urqlClient = new Client({
  exchanges: [mapExchange({
    onError(error) {
      console.error(error);
    },
  }),cacheExchange, fetchExchange],
  url: 'http://api.localhost:5000', // Update with your GraphQL server URL
  fetchOptions: () => {
    const token = getToken()
    const refreshToken = getCookie('refreshToken');
    return {
      headers: {authorization: token ? `Bearer ${token}` : '',
      refreshToken: refreshToken || '',
      
    }}
  },
  credentials: 'include',
  requestPolicy: 'cache-and-network'

});

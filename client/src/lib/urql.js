import { Client, cacheExchange, fetchExchange } from '@urql/svelte';

const getToken = () => {
  return localStorage.getItem('token') || ""
  }
  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
export const urqlClient = new Client({
  exchanges: [cacheExchange, fetchExchange],
  url: 'http://api.localhost:5000', // Update with your GraphQL server URL
  fetchOptions: () => {
    const token = getToken()
    const refreshToken = getCookie('refreshToken');
    return {
      headers: {authorization: token ? `Bearer ${token}` : '',
      refreshToken: refreshToken || '',
    }}
  }

});


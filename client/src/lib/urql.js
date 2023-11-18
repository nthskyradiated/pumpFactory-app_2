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
const mapExchangeHandler = ({ client, forward }) => (ops$) => {
  return ops$.map((operation) => {
    return forward(operation).map((result) => {
      // Check if there are errors in the result
      if (result.error) {
        // Handle the error, e.g., display an error message
        console.error('GraphQL error:', result.error);
        // Optionally, update your UI to show an error message to the user
      }

      return result;
    });
  });
};

export const urqlClient = new Client({
  exchanges: [cacheExchange, fetchExchange, mapExchange(mapExchangeHandler)],
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

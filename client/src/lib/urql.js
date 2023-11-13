import { Client, cacheExchange, fetchExchange } from '@urql/svelte';

const getToken = () => {
  return localStorage.getItem('token') || ""
  }
  
export const urqlClient = new Client({
  exchanges: [cacheExchange, fetchExchange],
  url: 'http://api.localhost:5000', // Update with your GraphQL server URL
  fetchOptions: () => {
    const token = getToken()
    return {
      headers: {authorization: token ? `Bearer ${token}` : ''}
    }
  }

});


import { Client, cacheExchange, fetchExchange } from '@urql/svelte';
  
export const urqlClient = new Client({
  exchanges: [cacheExchange, fetchExchange],
  url: 'http://api.localhost:5000', // Update with your GraphQL server URL

});
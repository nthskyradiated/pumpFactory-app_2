import { queryStore, getContextClient } from '@urql/svelte';
import {ClientByNameDocument, ClientsDocument} from '../../generated/graphql'
import { Client, mapExchange, cacheExchange, fetchExchange } from '@urql/svelte';

export async function load ({ cookies }) {
	
	

	const client = new Client({
		exchanges: [
		  mapExchange({
			onError(error) {
			  console.error(error);
	
			},
		  }),
		  cacheExchange,
		  fetchExchange,
		],
		url: 'http://localhost:5555', // Update with your GraphQL server URL

		fetchOptions: () => {
			const refreshTokenValue = cookies.get('refreshToken');
			const token = cookies.get('token');
		  
			// Log the values for verification
			console.log('Dashboard Token:', refreshTokenValue);
			console.log('Token:', token);
			return {
				token,
				refreshToken: refreshTokenValue,
			}
		}, requestPolicy: 'cache-and-network',
		credentials: 'include',
	}

	  );

	// console.log(getClients);
	  const getClientByName = async () => {
		try {
		  const result = await client.query(ClientByNameDocument, { name: searchValue }).toPromise();
		  return result.data?.clientByName || [];
		} catch (error) {
		  console.error('Error fetching client by name:', error.message);
		  return [];
		}
	  };
const getClients = queryStore({
	client,
	query: ClientsDocument
})
let isFetching = getClientByName.fetching || getClients.fetching
  let clients = getClientByName.clientByName || getClients.data?.clients || [];
  console.log(clients);
}
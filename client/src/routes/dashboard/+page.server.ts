
import {ClientByNameDocument, ClientsDocument} from '../../generated/graphql'
import { Client, mapExchange, cacheExchange, fetchExchange } from '@urql/svelte';

export async function load ({locals, cookies}) {
	const refreshToken = cookies.get('refreshToken');
	const token = cookies.get('token');
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
		  // const token = getToken();
		  return {
			headers: {
			  Cookie: `token=${token}`,
			  refreshToken
			},
			credentials: 'include',
		  };
		},
		requestPolicy: 'cache-and-network',
	  });
	
	let searchValue = '';

		const getClients = async () => {
			await client.query(ClientsDocument, {})
			.toPromise()
			.then(result => {
				return result
			})
			};

		// const result = await getClients()
		// if (result) {
		// 	console.log(result);
		// 	return result
		// }
}

<script>
	import { goto } from '$app/navigation';
	import { setContextClient, gql, mutationStore, Client, cacheExchange, fetchExchange } from '@urql/svelte';
  
	export const urqlClient = Client({
	  exchanges: [cacheExchange, fetchExchange],
	  url: 'http://api.localhost:5000', // Update with your GraphQL server URL
	});
	setContextClient(urqlClient);
  
	let username = '';
	let password = '';
	let result;
	let error = null;
  
	const login = async () => {
		try {
      result = mutationStore({
        client: urqlClient,
        query: gql`
          mutation LoginUser($username: String!, $password: String!) {
            loginUser(username: $username, password: $password) {
              token
              user {
                id
                email
                isAdmin
                name
                username
              }
            }
          }
        `,
        variables: { username, password },
      });
	  await urqlClient(result).toPromise();
		const response = result.data;
		const { loginUser } = response;
  
		if (loginUser) {
		  // Save the token to localStorage or a secure storage mechanism
		  localStorage.setItem('token', loginUser.token);
  
		  // Redirect to the dashboard page
		  goto('/dashboard');
  
		  // Clear the error state
		  error = null;
		}
	  } catch (e) {
		// Handle errors here
		console.error(e);
  
		// Update the error state
		error = 'Incorrect username or password';
	  }
	};
  </script>
  
  <main>
	<h1>Login</h1>
	{#if error}
	  <p style="color: red;">{error}</p>
	{/if}
	<form method="POST" on:submit|preventDefault={login}>
		<label>
			Username:
			<input type="text " bind:value={username} placeholder="enter username" />
		  </label>
		  <label>
			Password:
			<input type="password" bind:value={password} placeholder="enter password" />
		  </label>
		  <button type="submit">Login</button>
	</form>
  </main>
  
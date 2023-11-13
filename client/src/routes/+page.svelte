<script>
	import { goto } from '$app/navigation';
	import { setContextClient, gql, mutationStore, getContextClient } from '@urql/svelte';
	import {urqlClient} from '$lib/urql.js'
	setContextClient(urqlClient);
	let client = getContextClient();
	let username = '';
	let password = '';
	let error = null;
  
        const query = gql`
          mutation ($username: String!, $password: String!) {
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
	
	loginUser = async () => {
		client
		 .mutation(query, {username, password})
		 .toPromise()
		 .then((result) => {
			console.log(result.data.loginUser);
			 const {token} = result.data.loginUser
			 if (token) {
				 localStorage.setItem('token', token)
				 goto('/dashboard');

			   // Clear the error state
			   error = null;
			 }})
			 .catch((err) => {
				console.error(err.message)
				error = 'Incorrect username or password';
			 })

	}


	
  </script>
  
  <main>
	<h1>Pump Login Page</h1>
	{#if error}
	  <p style="color: red;">{error}</p>
	{/if}
	<form method="POST" on:submit|preventDefault={loginUser}>
		<label>
			Username:
			<input type="text " name='username' bind:value={username} placeholder="enter username" />
		  </label>
		  <label>
			Password:
			<input type="password" name='password' bind:value={password} placeholder="enter password" />
		  </label>
		  <button type="submit">Login</button>
	</form>
  </main>
  
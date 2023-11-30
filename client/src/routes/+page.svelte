<script>
	import { goto } from '$app/navigation';
	import { setContextClient, gql, getContextClient } from '@urql/svelte';
	import {urqlClient} from '$lib/urql.js'
	import {error} from '@sveltejs/kit'
	import {auth, refreshToken} from '$lib/auth.js'
 
	setContextClient(urqlClient);
	let client = getContextClient();
	let username = '';
	let password = '';
	let autherror;
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
			  refreshToken
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
				 console.log(result.data.loginUser.user.isAdmin);
				 auth.set({isAdmin: result.data.loginUser.user.isAdmin, isLoggedIn: true})
				 refreshToken.set({isAdmin: result.data.loginUser.refreshToken})
				 goto('/dashboard');
			 }})
			 .catch((err) => {
				console.error(err.message)
				autherror = 'Invalid Username or Password';
				return new error (401, autherror)
			 })

	}

  </script>

  
  <main>
	<form method="POST" on:submit|preventDefault={loginUser} class="mt-52 flex flex-col items-center justify-center gap-6">
		{#if autherror}
		  <p style="color: red;">{autherror}</p>
		{/if}
		<label>
			Username:
			<input type="text" class='input' name='username' bind:value={username} placeholder="enter username" />
		  </label>
		  <label>
			Password:
			<input type="password" class="input" name='password' bind:value={password} placeholder="enter password" />
		  </label>
		  <button type="submit button" class="btn variant-filled-primary">Login</button>
	</form>
  </main>
  
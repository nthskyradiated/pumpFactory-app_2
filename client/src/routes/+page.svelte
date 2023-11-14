<script>
	import { goto } from '$app/navigation';
	import { setContextClient, gql, getContextClient } from '@urql/svelte';
	import {urqlClient} from '$lib/urql.js'
	import {error} from '@sveltejs/kit'
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';


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
	<AppBar>
		<div class="flex flex-row-reverse gap-8 text-center justify-center">
			<h1 class="h1">Pump Login Page</h1>
			<div>
				<LightSwitch />
			</div>
		</div>
	</AppBar>
	<form method="POST" on:submit|preventDefault={loginUser} class="my-auto flex flex-col items-center justify-center gap-6 h-screen">
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
  
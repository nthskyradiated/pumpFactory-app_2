<script lang="ts">

	import type {ActionData} from './$types'
	export let form: ActionData
  </script>

  
  <main>
	<form action="?/login" method="POST" class="mt-52 flex flex-col items-center justify-center gap-6">
		<label for="username">
			Username:
			<input type="text" class='input' name='username' placeholder="enter username" />
		  </label>
		  <label>
			Password:
			<input type="password" class="input" name='password' placeholder="enter password" />
		  </label>
		{#if form?.invalid}
		  <p class="error">Username and password is required.</p>
		{/if}
	  
		{#if form?.credentials}
		  <p class="error">You have entered the wrong credentials.</p>
		{/if}
		<button type="submit" class="btn variant-filled-primary">Login</button>
	  </form>

  </main>
  
<!-- src/routes/Dashboard.svelte -->
<script>
    import { onMount } from 'svelte';
    import { gql } from '@urql/svelte';
    import {urqlClient} from '../+page.svelte'
    import { goto } from '$app/navigation';
  
    let userData = null;
  
    onMount(async () => {
      // Fetch user data when the component mounts
      const query = gql`
        query {
          getUserInfo {
            username
            // Include other user fields as needed
          }
        }
      `;
  
      const response = await urqlClient.query(query).toPromise();
      userData = response.data.getUserInfo;
    });
  </script>
  
  <main>
    {#if userData}
      <h1>Welcome, {userData.username}!</h1>
      <!-- Display other user information as needed -->
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
  
<!-- src/routes/Dashboard.svelte -->
<script>
    import { onMount } from 'svelte';
    import { gql, queryStore, getContextClient } from '@urql/svelte';
    import {urqlClient} from '$lib/urql.js'
  
    let users
  
    onMount(async () => {
        result = queryStore({
            client: getContextClient(urqlClient),
            query: gql`
        query Clients {
          clients {
            id
            name
            email
            phone
            birthdate
            age
            waiver
            membershipStatus
          }
        }
      `
        })

      const response = await urqlClient(result).toPromise();
      users = response.data.clients; // Update to the correct field in your response
    });
  </script>
  
  <main>
    {#if users}
      {#each users as user}
        <h1>Welcome, {user.name}!</h1>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <!-- Display other user information as needed -->
      {/each}
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
  
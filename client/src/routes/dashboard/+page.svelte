<!-- src/routes/Dashboard.svelte -->
<script>
    import { gql, queryStore, getContextClient, setContextClient } from '@urql/svelte';
    import {urqlClient} from '$lib/urql.js'

  
setContextClient(urqlClient)
        const clients = queryStore({
            client: getContextClient(),
            query: gql`
        query {
          clients {
            id
            name
            email
            phone

          }
        }
      `
        })

console.log(clients);
  </script>
  
  <main>
    {#if $clients.data}
      {#each $clients.data.clients as client}
        <h1>Welcome, {client.name}!</h1>
        <p>Email: {client.email}</p>
        <p>Phone: {client.phone}</p>
        <!-- Display other user information as needed -->
      {/each}
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
  
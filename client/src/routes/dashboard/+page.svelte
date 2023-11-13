<!-- src/routes/Dashboard.svelte -->

<script>
  import Navbar from '../../components/Navbar.svelte'
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import {urqlClient} from '$lib/urql.js'
  setContextClient(urqlClient)
  const getClients = queryStore({
    client: getContextClient(),
    query: gql`
      query {
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
    `,
  });
</script>
<Navbar />
{#if $getClients.fetching}
<p>Loading...</p>
{:else if $getClients.error}
<p>Oh no... {$getClients.error.message}</p>
{:else}
<ul>
  {#each $getClients.data.clients as client}
  <li>{client.name} - {client.email} - {client.age}</li>
  {/each}
</ul>
{/if}

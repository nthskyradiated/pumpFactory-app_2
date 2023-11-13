<!-- src/routes/Dashboard.svelte -->

<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import {urqlClient} from '$lib/urql.js'
  setContextClient(urqlClient)
  const todos = queryStore({
    client: getContextClient(),
    query: gql`
      query {
        clients {
          id
          name
        }
      }
    `,
  });
</script>

{#if $todos.fetching}
<p>Loading...</p>
{:else if $todos.error}
<p>Oh no... {$todos.error.message}</p>
{:else}
<ul>
  {#each $todos.data.clients as client}
  <li>{client.name}</li>
  {/each}
</ul>
{/if}



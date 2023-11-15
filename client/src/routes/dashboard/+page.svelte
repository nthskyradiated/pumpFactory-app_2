<!-- src/routes/Dashboard.svelte -->

<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import {urqlClient} from '$lib/urql.js'
  setContextClient(urqlClient)
  const client = getContextClient()
  let sourceData =[]
  let clients
  const getClients = queryStore({
    client,
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

  async function query() {
    sourceData = $getClients.data.clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      birthdate: client.birthdate,
      age: client.age,
      membershipStatus: client.membershipStatus,
      waiver: client.waiver,
    }));
    console.log([...$getClients.data.clients]);
    return sourceData;
  }

  $: clients = query();

  // console.log(sourceData)
</script>

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

<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import { urqlClient } from '$lib/urql.js';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues } from '@skeletonlabs/skeleton';

  setContextClient(urqlClient);
  const client = getContextClient();

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

  let isFetching = $getClients.fetching;
  let clients = $getClients.data?.clients || [];

  $: {
    isFetching = $getClients.fetching;
    clients = $getClients.data?.clients || [];
  }

  $: tableSimple = {
    head: ['ID', 'Name', 'Email', 'Phone', 'Birthdate', 'Age', 'MembershipStatus', 'Waiver'],
    body: tableMapperValues(clients, [
      'id',
      'name',
      'email',
      'phone',
      'birthdate',
      'age',
      'membershipStatus',
      'waiver',
    ]),
  };
</script>

{#if isFetching}
  <!-- <p>Loading...</p> -->
  <Spinner />
{:else if $getClients.error}
  <p>Oh no... {$getClients.error.message}</p>
{:else}

  {#if clients.length > 0}

<Table source={tableSimple} interactive={true}/>
  {/if}
{/if}

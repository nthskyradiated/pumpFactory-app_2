<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import { urqlClient } from '$lib/urql.js';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues } from '@skeletonlabs/skeleton';

  setContextClient(urqlClient);
  const client = getContextClient();
  let clients;
  let sourceData = [];

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

  $: clients = $getClients.data?.clients || [];

  $: sourceData = clients.map(async (client) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    birthdate: client.birthdate,
    age: client.age,
    membershipStatus: client.membershipStatus,
    waiver: client.waiver,
  }));
  // console.log($getClients.error.graphQLErrors);
  const isFetching = $getClients.fetching;

  const tableSimple = {
    head: ['ID', 'Name', 'Email', 'Phone', 'Birthdate', 'Age', 'MembershipStatus', 'Waiver'],
    body: tableMapperValues(sourceData || [], [
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
  <p>Loading...</p>
  <Spinner />
{:else if $getClients.error}
  <p>Oh no... {$getClients.error.message}</p>
{:else}
  <ul>
    {#each clients as client}
      <li>{client.name} - {client.email} - {client.age}</li>
    {/each}
  </ul>
  {#if clients.length > 0}
    <Table source={tableSimple} />
  {/if}
{/if}

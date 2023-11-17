<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import { urqlClient } from '$lib/urql.js';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues, getModalStore, Modal } from '@skeletonlabs/skeleton';
  import { Paginator } from '@skeletonlabs/skeleton';

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

  const modalStore = getModalStore();

  let isFetching = $getClients.fetching;
  let clients = $getClients.data?.clients || [];

  $: {
    isFetching = $getClients.fetching;
    clients = $getClients.data?.clients || [];
  }

  $: tableSimple = {
    head: ['ID', 'Name', 'Email', 'Phone', 'Birthdate', 'Age', 'MembershipStatus', 'Waiver'],
    body: tableMapperValues(paginatedSource, [
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


let paginationSettings = {
	page: 0,
	limit: 5,
	size: clients.length,
	amounts: [3,5,10],
} 
$: paginatedSource = clients.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);



const modal = {
	type: 'component',
  component: 'addClientModal'
};



					
</script>

{#if isFetching}

  <Spinner />
{:else if $getClients.error}
  <p>Oh no... {$getClients.error.message}</p>
{:else}

  {#if clients.length > 0}

<Table source={tableSimple} interactive={true}/>

<Paginator
	bind:settings={paginationSettings}
	showFirstLastButtons="{true}"
	showPreviousNextButtons="{true}"
/>

<button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add Client</button>

  {/if}
{/if}

<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues, getModalStore } from '@skeletonlabs/skeleton';
  import { Paginator } from '@skeletonlabs/skeleton';
  import {clientID} from '$lib/clientStore'
  import { goto, preloadData } from '$app/navigation';


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

  let ID

  let isFetching = $getClients.fetching;
  let clients = $getClients.data?.clients || [];

  
  let paginationSettings = {
	page: 0,
	limit: 10,
	size: clients.length,
	amounts: [3,5,10],
} 

$: paginationSettings = {
 ...paginationSettings,
   size: clients.length,

}
  const modalStore = getModalStore();


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



$: paginatedSource = clients.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);



const modal = {
	type: 'component',
  component: 'addClientModal'
};
const updateModal = {
	type: 'component',
  component: 'updateClientModal'
};
const mySelectionHandler = (event) => {
    // Extract the ID from the 'detail' array in the event
    const ID = event.detail[0];
    clientID.set(ID)
    // preloadData(`/client/${ID}`)
    goto(`/client/${ID}`)
    
  };

</script>
<main class='w-10/12 m-auto pt-8'>
  <h2 class='h2 mb-5'>Client List</h2>
  {#if isFetching}
  
    <Spinner />
  {:else if $getClients.error}
    <p>Oh no... {$getClients.error.message}</p>
  {:else}
  
    {#if clients.length > 0}
  
  <Table source={tableSimple} interactive={true} on:selected={mySelectionHandler} class="pb-8"/>
  
  <Paginator
    bind:settings={paginationSettings}
    showFirstLastButtons="{true}"
    showPreviousNextButtons="{true}"
    justify-between="{true}"
    class="pb-8"
  />
  
  <button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add Client</button>
  
    {/if}
  {/if}
</main>

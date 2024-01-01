<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { Table, tableMapperValues, getModalStore } from '@skeletonlabs/skeleton';
  import { Paginator } from '@skeletonlabs/skeleton';
  import Icon from '@iconify/svelte';
  import {clientID} from '$lib/clientStore'
  import { goto, preloadData } from '$app/navigation';

  export let data
  const {searchValue} = data;
  const client = getContextClient();

  const getClientByName = queryStore({
    client,
    query: gql`
      query clientByName($name: String!){
        clientByName (name: $name){
          id
          name
          email
          phone
          birthdate
          age
          waiver
          membershipStatus
          clientSessionCounter
          clientExpiresIn
        }
      }
    `,
    variables: {name: searchValue}
  });

  
  let isFetching = $getClientByName.fetching || []
  let clients = $getClientByName.data?.clientByName || [];
  console.log(clients);

  let paginationSettings = {
	page: 0,
	limit: 30,
	size: clients.length,
	amounts: [5,10,20,30],
} 


let paginatedSource = clients.slice(
  paginationSettings.page * paginationSettings.limit,
  paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);
$: {
    isFetching = $getClientByName.fetching
    clients = $getClientByName.data?.clientByName || [];

    // Update the pagination size
    paginationSettings.size = clients.length;

    // Update the paginated source
    paginatedSource = clients.slice(
      paginationSettings.page * paginationSettings.limit,
      paginationSettings.page * paginationSettings.limit + paginationSettings.limit
    );
  }




$: tableSimple = {
  head: ['ID', 'Name', 'Email', 'Phone',  'Status', 'Expiry', 'Waiver'],
  body: tableMapperValues(paginatedSource, [
    'id',
    'name',
    'email',
    'phone',
    'membershipStatus',
    'clientExpiresIn',
    'waiver',
    
  ]),
}

const modalStore = getModalStore();
const modal = {
  type: 'component',
  component: 'addClientModal'
};

const mySelectionHandler = (event) => {
    // Extract the ID from the 'detail' array in the event
    const ID = event.detail[0];
    clientID.set(ID)
    goto(`/client/${ID}`)
    
  };
$: searchValue
  const mySearchClientHandler = async (event) => {
    try {
      const clients = await getClientByName();
      console.log('Clients:', clients);
      // console.log($searchValue);
      // searchValue.set($searchValue); // Set the searchValue in the store
      // goto(`/result/${$searchValue}`);
      return clients
    } catch (error) {
      console.error('Error in search handler:', error.message);
    }
  };

</script>
<main class='w-10/12 m-auto pt-8'>
  <div class="flex flex-row justify-between mb-4 align-bottom">
    <h2 class='h2'>Filtered Client Result</h2>
  </div>
  
  {#if isFetching}
  
    <Spinner />
  {:else if $getClientByName.error}
    <p>Oh no... {$getClientByName.error.message}</p>
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
  {:else if clients.length === 0}
  <p class="mb-8">Oh no... Client record for <strong>{searchValue}</strong> not found... Did you type correctly?</p>
  
  {/if}
  {/if}
  <button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add Client</button>
</main>
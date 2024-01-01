<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues, getModalStore } from '@skeletonlabs/skeleton';
  import { Paginator } from '@skeletonlabs/skeleton';
  import Icon from '@iconify/svelte';
  import {clientID} from '$lib/clientStore'
  import { goto, preloadData } from '$app/navigation';


  const client = getContextClient();
  let searchValue = ''
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
          clientSessionCounter
          clientExpiresIn
        }
      }
    `,
  });

  const query = gql`
    query ClientByName($name: String!) {
      clientByName(name: $name) {
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
  `;
    const getClientByName = async () => {
    try {
      const result = await client.query(query, { name: searchValue }).toPromise();
      return result.data?.clientByName || [];
    } catch (error) {
      console.error('Error fetching client by name:', error.message);
      return [];
    }
  };
  
  let isFetching = getClientByName.fetching || $getClients.fetching
  let clients = getClientByName.data?.clientByName || $getClients.data?.clients || [];
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
  
  let tableSimple = {
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
  
  function setTableSource() {
    console.log(paginatedSource);
    paginatedSource = paginatedSource
    return {
      head: ['ID', 'Name', 'Email', 'Phone',  'Status', 'Expiry', 'Waiver'],
      body: tableMapperValues(paginatedSource, [
        'id',
        'name',
        'email',
        'phone',
        'membershipStatus',
        'clientExpiresIn',
      'waiver',
      
    ])
  }}
  
  console.log(paginatedSource);
  
  
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
  
  const mySearchClientHandler = async () => {
    
    try {
      const clients = await getClientByName();
      // console.log('Clients:', clients);
      // console.log(searchValue);
      // console.log(clients.length);
      paginatedSource = clients.slice(
      paginationSettings.page * paginationSettings.limit,
      paginationSettings.page * paginationSettings.limit + paginationSettings.limit
    );
      // goto(`/result/${searchValue}`);
      return clients
    } catch (error) {
      console.error('Error in search handler:', error.message);
    }
  };
  
  $: paginationSettings = {...paginationSettings, size: clients.length}
  console.log(paginationSettings.size);
  
  $: clients = getClientByName.data?.clientByName || $getClients.data?.clients || [];
  $: isFetching = getClientByName.fetching || $getClients.fetching
  
  $: paginatedSource = clients.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit + paginationSettings.limit
    );
    
 $: tableSimple = paginatedSource ? setTableSource() : undefined

  </script>
<main class='w-10/12 m-auto pt-8'>
  <div class="flex md:flex-row flex-col justify-between mb-4 align-bottom">
    <h2 class='h2 mb-5'>Client List</h2>
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] sm:w-2/6 w-full sm:grid-cols-3[auto_auto_auto]">
      <div class="input-group-shim"><Icon icon="emojione:skull" /></div>
        <input type="search" placeholder="Search by name..." bind:value={searchValue} on:input={() => {mySearchClientHandler}} on:keydown={(e)=> {if(e.key ==='Enter') {mySearchClientHandler()}}}/>
        <button class="variant-filled-secondary w-auto" type="button" on:click={mySearchClientHandler}>Submit</button>

    </div>
		
  </div>
  
  {#if isFetching}
  
    <Spinner />
  {:else if $getClients.error}
    <p class="mb-8">Oh no... {$getClients.error.message}</p>
  {:else}
  
  {#if clients.length > 0}
  
  <Table source={tableSimple} interactive={true} on:selected={mySelectionHandler} class="pb-8"/>

  <!-- {#if paginatedSource.length === 0}
  <p class="mb-8">Oh no... Client record for <strong>{searchValue}</strong> not found... Did you type correctly?</p>
  {/if} -->

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
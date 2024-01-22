<script lang='ts'>
  import { queryStore, getContextClient } from '@urql/svelte';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues, getModalStore } from '@skeletonlabs/skeleton';
  import { Paginator } from '@skeletonlabs/skeleton';
  import Icon from '@iconify/svelte';
  import {clientID} from '$lib/clientStore'
  import { goto } from '$app/navigation';
  import {ClientByNameDocument, ClientsDocument} from '../../generated/graphql'
  import type { PageData } from './$types';
  export let data: PageData;
// console.log(data.clients);
// console.log(result);

  // const client = getContextClient();
  let searchValue = ''
  // const getClients = queryStore({
  //   client,
  //   query: ClientsDocument
  // });

  //   const getClientByName = async () => {
  //   try {
  //     const result = await client.query(ClientByNameDocument, { name: searchValue }).toPromise();
  //     return result.data?.clientByName || [];
  //   } catch (error) {
  //     console.error('Error fetching client by name:', error.message);
  //     return [];
  //   }
  // };
  
  // let isFetching = getClientByName.fetching || $getClients.fetching
  // let clients = getClientByName.data?.clientByName || $getClients.data?.clients || [];
  // console.log(clients);
  
  // let paginationSettings = {
  //   page: 0,
  //   limit: 30,
  //   size: clients.length,
  //   amounts: [5,10,20,30],
  // } 

  
  // let paginatedSource = clients.slice(
  //   paginationSettings.page * paginationSettings.limit,
  //   paginationSettings.page * paginationSettings.limit + paginationSettings.limit
  // );
  
//   let tableSimple = {
//     head: ['ID', 'Name', 'Email', 'Phone',  'Status', 'Expiry', 'Waiver'],
//     body: tableMapperValues(paginatedSource, [
//       'id',
//       'name',
//       'email',
//       'phone',
//       'membershipStatus',
//       'clientExpiresIn',
//       'waiver',
    
//   ]),
// }

  
  
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
  

  </script>
<main class='w-10/12 m-auto pt-8'>
  <!-- <div class="flex md:flex-row flex-col justify-between mb-4 align-bottom">
    <h2 class='h2 mb-5'>Client List</h2>
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] sm:w-2/6 w-full sm:grid-cols-3[auto_auto_auto]">
      <div class="input-group-shim"><Icon icon="emojione:skull" /></div>
        <input type="search" placeholder="Search by name..." bind:value={searchValue} on:input={() => {mySearchClientHandler}} on:keydown={(e)=> {if(e.key ==='Enter') {mySearchClientHandler()}}}/>
        <button class="variant-filled-secondary w-auto" type="button" on:click={mySearchClientHandler}>Submit</button>

    </div>
		
  </div> -->
  
  <!-- {#if isFetching}
  
    <Spinner />
  {:else if $getClients.error}
    <p class="mb-8">Oh no... {$getClients.error.message}</p>
  {:else}
  
  {#if clients.length > 0}
  
  <Table source={tableSimple} interactive={true} on:selected={mySelectionHandler} class="pb-8"/> -->
  <div class="table-container  pb-8">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Package</th>
          <th>Expiry</th>
        </tr>
      </thead>
      <tbody>
        {#each data as client (client.id)}
          <tr on:click={mySelectionHandler(client.id)}>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>{client.membershipStatus}</td>
            {#if client.product}
            <td>{client.product?.name}</td>
            {:else if !client.product}
            <td>N/A</td>
            {/if}
            <td>{client.clientExpiresIn}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <!-- {#if paginatedSource.length === 0}
  <p class="mb-8">Oh no... Client record for <strong>{searchValue}</strong> not found... Did you type correctly?</p>
  {/if} -->

  <!-- <Paginator
  bind:settings={paginationSettings}
  showFirstLastButtons="{true}"
  showPreviousNextButtons="{true}"
  justify-between="{true}"
  class="pb-8"
  /> -->
  
  <button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add Client</button>
  <!-- {/if} -->
  <!-- {/if} -->
</main>
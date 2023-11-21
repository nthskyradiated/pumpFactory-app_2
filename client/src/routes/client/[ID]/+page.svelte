<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { Table, tableMapperValues, getModalStore } from '@skeletonlabs/skeleton';
  import { Paginator } from '@skeletonlabs/skeleton';
  import {clientID} from '$lib/clientStore'


export let data
let {ID} = data
  const client = getContextClient();

  let getClient = queryStore({
      client,
      query: gql`
        query ($id: ID!){
          client (ID: $id){
            id
            name
            email
            phone
            birthdate
            age
            waiver
            membershipStatus
            product {
                name
              }
            attendance {
                checkIn
                productId
              }
          }
        }
      `,
      variables: {ID}
    });


  let isFetching = $getClient.fetching;
  let singleClient = $getClient.data?.client
  // console.log($getClient?.data);


  
  let paginationSettings = {
	page: 0,
	limit: 10,
	size: getClient.length,
	amounts: [3,5,10],
} 

$: paginationSettings = {
 ...paginationSettings,
   size: getClient.length,

}
  const modalStore = getModalStore();


  $: {
    isFetching = $getClient.fetching;
    singleClient = $getClient.data?.clients || [];
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



$: paginatedSource = singleClient.slice(
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
    // const ID = event.detail[0];
    // console.log(ID);
    // clientID.set(ID)
    // console.log($clientID);
    // modalStore.trigger(updateModal)
    
  };

      

			
</script>

{#if isFetching}

  <Spinner />
{:else if $getClient.error}
  <p>Oh no... {$getClient.error.message}</p>
{:else}

  {#if singleClient.length > 0}

<Table source={tableSimple} interactive={true} on:selected={mySelectionHandler} />


<Paginator
	bind:settings={paginationSettings}
	showFirstLastButtons="{true}"
	showPreviousNextButtons="{true}"
/>

<button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add Client</button>

  {/if}
{/if}

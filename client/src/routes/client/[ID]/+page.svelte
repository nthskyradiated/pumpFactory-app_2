<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { Table, tableMapperValues, getModalStore } from '@skeletonlabs/skeleton';
  import { Paginator } from '@skeletonlabs/skeleton';
  import {clientID} from '$lib/clientStore'


export let data
let {ID} = data
// let ID = $clientID
// console.log(ID);
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
                description
              }
            attendance {
                checkIn
                productId
              }
          }
        }
      `,
      variables: {id: ID}
    });


  let isFetching = $getClient.fetching;
  let singleClient = $getClient.data?.client


  const modalStore = getModalStore();


  $: {
    isFetching = $getClient.fetching;
    singleClient = $getClient.data?.client || [];
  }


const modal = {
	type: 'component',
  component: 'addClientModal'
};
const updateModal = {
	type: 'component',
  component: 'updateClientModal'
};

console.log(singleClient);
			
</script>

{#if isFetching}

  <Spinner />
{:else if $getClient.error}
  <p>Oh no... {$getClient.error.message}</p>
{:else}

  <h1>{$getClient.data.client.id}</h1>
  <h1>{$getClient.data.client.name}</h1>
  <h1>{$getClient.data.client.email}</h1>
  <h1>{$getClient.data.client.phone}</h1>
  <h1>{$getClient.data.client.birthdate}</h1>
  <h1>{$getClient.data.client.age}</h1>
  <h1>{$getClient.data.client.membershipStatus}</h1>
  <h1>{$getClient.data.client.waiver}</h1>
  <!-- <h1>{$getClient.data.client.product.name}</h1>
  <h1>{$getClient.data.client.product.description}</h1>
  <h1>{$getClient.data.client.attendance[0].checkIn}</h1>
  <h1>{$getClient.data.client.attendance[0].productId}</h1> -->


<button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add Client</button>

  {/if}

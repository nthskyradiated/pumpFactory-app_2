<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { TabGroup, Tab, getModalStore } from '@skeletonlabs/skeleton';
  import {tabSet} from '$lib/utilsStore'
  import Icon from '@iconify/svelte';
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
  
  $: {
    isFetching = $getClient.fetching;
    singleClient = $getClient.data?.client || [];
  }

const modalStore = getModalStore();

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




<div class="card p-4 mt-8">
  <TabGroup>
    <Tab bind:group={$tabSet} name="tab1" value={0}>
      <svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>
      Client Details
    </Tab>
    <Tab bind:group={$tabSet} name="tab2" value={1}><svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>Product Enrolment</Tab>
    <Tab bind:group={$tabSet} name="tab3" value={2}><svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>Sessions</Tab>
    <!-- Tab Panels --->
    <svelte:fragment slot="panel">
      {#if $tabSet === 0}
      <h1 class='h4 mb-1'>Id:</h1><h1 class='h5 mb-1'>{$getClient.data.client.id}</h1>
      <h1 class='h4 mb-1'>Name:</h1><h1 class='h5 mb-1'>{$getClient.data.client.name}</h1>
      <h1 class='h4 mb-1'>Email:</h1><h1 class='h5 mb-1'>{$getClient.data.client.email}</h1>
      <h1 class='h4 mb-1'>Phone:</h1><h1 class='h5 mb-1'>{$getClient.data.client.phone}</h1>
      <h1 class='h4 mb-1'>Birthdate:</h1><h1 class='h5 mb-1'>{$getClient.data.client.birthdate}</h1>
      <h1 class='h4 mb-1'>Age:</h1><h1 class='h5 mb-1'>{$getClient.data.client.age}</h1>
      <h1 class='h4 mb-1'>Status:</h1><h1 class='h5 mb-1'>{$getClient.data.client.membershipStatus}</h1>
      <h1 class='h4 mb-1'>Waiver:</h1><h1 class='h5 mb-1'>{$getClient.data.client.waiver}</h1>
      {:else if $tabSet === 1}
      {#if $getClient.data.client.product}
      <h1 class='h4 mb-1'>Product Name:</h1><h1 class='h5 mb-1'>{$getClient.data.client.product.name}</h1>
      <h1 class='h4 mb-1'>Product Description:</h1><h1 class='h5 mb-1'>{$getClient.data.client.product.description}</h1>
      {:else}
      <h1 class='h5 mb-1'>Client not enrolled in any product</h1>
      {/if}
      {:else if $tabSet === 2}
      {#if !$getClient.data.client.attendance || $getClient.data.client.attendance.length === 0}
        <h1 class='h5 mb-1'>No attendance history for this client</h1>
      {:else}
        {#each $getClient.data.client.attendance as attendance}
          <div>
            <h1 class='h4 mb-1'>Session Date:</h1>
            <h1 class='h5 mb-1'>{attendance.checkIn}</h1>
            <h1 class='h4 mb-1'>Product id:</h1>
            <h1 class='h5 mb-1'>{attendance.productId}</h1>
          </div>
        {/each}
      {/if}
    {/if}
    
    </svelte:fragment>
  </TabGroup>
</div>

<button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(updateModal)}}>Update Client</button>

  {/if}

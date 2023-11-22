<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { TabGroup, Tab, getModalStore } from '@skeletonlabs/skeleton';

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
let tabSet = 3

console.log(singleClient);
			
</script>

{#if isFetching}

  <Spinner />
{:else if $getClient.error}
  <p>Oh no... {$getClient.error.message}</p>
{:else}





  <TabGroup>
    <Tab bind:group={tabSet} name="tab1" value={0}>
      <!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
      <span>Client Details</span>
    </Tab>
    <Tab bind:group={tabSet} name="tab2" value={1}>Product Enrolment</Tab>
    <Tab bind:group={tabSet} name="tab3" value={2}>Sessions</Tab>
    <!-- Tab Panels --->
    <svelte:fragment slot="panel">
      {#if tabSet === 0}
      <h1>{$getClient.data.client.id}</h1>
      <h1>{$getClient.data.client.name}</h1>
      <h1>{$getClient.data.client.email}</h1>
      <h1>{$getClient.data.client.phone}</h1>
      <h1>{$getClient.data.client.birthdate}</h1>
      <h1>{$getClient.data.client.age}</h1>
      <h1>{$getClient.data.client.membershipStatus}</h1>
      <h1>{$getClient.data.client.waiver}</h1>
      {:else if tabSet === 1}
      <h1>{$getClient.data.client.product.name}</h1>
      <h1>{$getClient.data.client.product.description}</h1>
      {:else if tabSet === 2}
  <h1>{$getClient.data.client.attendance[0].checkIn}</h1>
  <h1>{$getClient.data.client.attendance[0].productId}</h1>
      {/if}
    </svelte:fragment>
  </TabGroup>
        

<button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(updateModal)}}>Update Client</button>

  {/if}

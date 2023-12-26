<script>
  import { queryStore, gql, mutationStore, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { TabGroup, Tab, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
  import {tabSet, deleteDocumentStore} from '$lib/utilsStore'
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import {auth} from '$lib/auth.js'
export let data
let {ID} = data
let result
const toastStore = getToastStore();
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
                id
                name
                description
              }
            attendance {
                checkIn
                productId
                product {
                  name
                }
              }
            documents {
              id
              documentName
              documentType
              documentURL
            }
          }
        }
      `,
      variables: {id: ID}
    });

    const deleteClient = async ( deleteClientId ) => {
    result = mutationStore({
      client,
      query: gql`
    mutation DeleteClient($deleteClientId: ID!) {
        deleteClient(id: $deleteClientId) {
        id
        name
        }
    }
      `,
      variables: { deleteClientId },
    });
    await result;
    if (result.error) {
      console.error('Mutation error:', result.error);
    } else {
      const t = {
        message: "Deleted Client",
        timeout: 2000
      };
      toastStore.trigger(t);
      goto('/dashboard');
    }
  };

  const deleteFileOnServer = async (documentURL) => {
    try {
      const response = await fetch(`${documentURL}`, {
        method: 'DELETE',
        // headers: {
        //   'Content-Type': 'application/json',
        //   // You may need to include additional headers like authorization
        // },
      });

      if (!response.ok) {
        console.log(response.toString());
        throw new Error('Failed to delete file on server');
      }

      const result = await response.json();
      console.log('File deleted on server:', result);
    } catch (error) {
      console.error('Error deleting file on server:', error);
    }
  };

  const deleteClientDocument = async ( deleteClientDocumentId, documentURL ) => {
    await deleteFileOnServer(documentURL)
    console.log(documentURL);
    console.log(deleteClientDocumentId);
    result = mutationStore({
      client,
      query: gql`
      mutation ($deleteClientDocumentId: ID!) {
        deleteClientDocument(id: $deleteClientDocumentId) {
        documentName
        documentType
        documentURL
      }   
    }
      `,
      variables: { deleteClientDocumentId },
    })
      await result;
      if (result.error) {
        console.error('Mutation error:', result.error);
      } else {
        const t = {
          message: "Deleted Client Document",
          timeout: 2000
        };
        toastStore.trigger(t);
        goto('/dashboard');
      }
    }
      
  


  const addAttendance = async ({ input }) => {
	  result = mutationStore({
		client,
		query: gql`
  mutation Mutation($input: AddAttendanceInput!) {
  addAttendance(input: $input) {
    checkIn
    clientId
    productId
  }
}
		`,
		variables: { input: addAttendanceInput },
	  });
    await result;
    if (result.error) {
      console.error('Mutation error:', result.error);
    } else {
      const t = {
        message: "Session booked",
        timeout: 2000
      };
      toastStore.trigger(t);
      goto('/dashboard')
    }
	};


  $: isFetching = $getClient.fetching;
  $: singleClient = $getClient.data?.client;
  $: deleteClientId = singleClient?.id
  $: addAttendanceInput = {
    clientId: singleClient?.id,
    productId: singleClient?.product?.id || null
  }
const modalStore = getModalStore();

$: updateModal = {
	type: 'component',
  component: 'updateClientModal',
  props: {singleClient: singleClient, isFetching},
  meta: {singleClient: singleClient}
  
};
$: addClientDocumentModal = {
	type: 'component',
  component: 'addClientDocumentModal',
  props: {singleClient: singleClient, isFetching},
  meta: {singleClient: singleClient}
  
};
const deleteModal = {
	type: 'confirm',
	title: 'Deleting Client Data',
	body: 'Are you sure you wish to proceed?',
	// TRUE if confirm pressed, FALSE if cancel pressed
	response: async (r) => !r? modalStore.close(): await deleteClient(deleteClientId)  
  } 
  const deleteClientDocumentModal = {
  type: 'confirm',
  title: 'Deleting Client Document',
  body: 'Are you sure you wish to proceed?',
  // TRUE if confirm pressed, FALSE if cancel pressed
  response: async (r) => {
    if (!r) {
      modalStore.close();
    } else {
        const {documentId, documentURL} = $deleteDocumentStore;
        if (documentId && documentURL) {
          await deleteClientDocument(documentId, documentURL);
          deleteDocumentStore.set(null); // Reset the store after deletion
        }
      }
  },
};

const addAttendanceModal = {
	type: 'confirm',
	title: 'Record Client Session',
	body: 'Recording client session now. click confirm to proceed...',
	// TRUE if confirm pressed, FALSE if cancel pressed
	response: async (r) => !r? modalStore.close(): await addAttendance(addAttendanceInput)  
  } 
    
  console.log($getClient.data);

</script>

<main class='w-10/12 m-auto pt-8'>

  {#if isFetching}
  
    <Spinner />
  {:else if $getClient.error}
    <p>Oh no... {$getClient.error.message}</p>
  {:else}
  
  <div class="card p-4">
    <TabGroup class='pb-2'>
      <Tab bind:group={$tabSet} name="tab1" value={0}>
        <svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>
        Client Details
      </Tab>
      <Tab bind:group={$tabSet} name="tab2" value={1}><svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>Product Enrolment</Tab>
      <Tab bind:group={$tabSet} name="tab3" value={2}><svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>Sessions</Tab>
      <Tab bind:group={$tabSet} name="tab4" value={3}><svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>Documents</Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        {#if $tabSet === 0}
        <h1 class='h4 mb-1'>Id:</h1><h1 class='h5 mb-1'>{singleClient.id}</h1>
        <h1 class='h4 mb-1'>Name:</h1><h1 class='h5 mb-1'>{singleClient.name}</h1>
        <h1 class='h4 mb-1'>Email:</h1><h1 class='h5 mb-1'>{singleClient.email}</h1>
        <h1 class='h4 mb-1'>Phone:</h1><h1 class='h5 mb-1'>{singleClient.phone}</h1>
        <h1 class='h4 mb-1'>Birthdate:</h1><h1 class='h5 mb-1'>{singleClient.birthdate}</h1>
        <h1 class='h4 mb-1'>Age:</h1><h1 class='h5 mb-1'>{singleClient.age}</h1>
        <h1 class='h4 mb-1'>Status:</h1><h1 class='h5 mb-1'>{singleClient.membershipStatus}</h1>
        <h1 class='h4 mb-1'>Waiver:</h1><h1 class='h5 mb-1'>{singleClient.waiver}</h1>
        {#if $auth.isAdmin}
        <button type="button" class="btn variant-filled mt-8" on:click={ () => {modalStore.trigger(deleteModal)}}>
          <Icon icon="la:skull-crossbones" />
          <span>Delete Client</span>
        </button>
        {/if}
        {:else if $tabSet === 1}
        {#if singleClient.product}
        <h1 class='h4 mb-1'>Product Name:</h1><h1 class='h5 mb-1'>{singleClient.product.name}</h1>
        <h1 class='h4 mb-1'>Product Description:</h1><h1 class='h5 mb-1'>{singleClient.product.description}</h1>
        {:else}
        <h1 class='h5 mb-1'>Client not enrolled in any product</h1>
        {/if}
        {:else if $tabSet === 2}
        {#if !singleClient.attendance || singleClient.attendance.length === 0}
          <h1 class='h5 mb-1'>No attendance history for this client</h1>
        {:else}
          {#each singleClient.attendance as attendance}
            <div class='card p-3 my-2'>
              <h1 class='h4 mb-1'>Session Date:</h1>
              <h1 class='h5 mb-1'>{attendance.checkIn}</h1>
              <h1 class='h4 mb-1'>Product id:</h1>
              <h1 class='h5 mb-1'>{attendance.productId}</h1>
              <h1 class='h4 mb-1'>Enrolled Package</h1>
              <h1 class='h5 mb-1'>{attendance.product.name}</h1>
            </div>
          {/each}
          {/if}
          {:else if $tabSet === 3}
          {#if !singleClient.documents || singleClient.documents.length === 0}
          <h1 class='h5 mb-1'>No uploaded document for this client</h1>
          {:else}
          {#each singleClient.documents as document}
          <div class='card p-3 my-2'>
            <h1 class='h4 mb-1'>Document Name:</h1>
            <a href={document.documentURL}><h1 class='h5 mb-2'>{document.documentName}</h1></a>
            <h1 class='h4 mb-1'>Document Type:</h1>
            <h1 class='h5 mb-2'>{document.documentType}</h1>
            <button type="button" class="btn variant-filled mt-8" on:click={ () => {deleteDocumentStore.set({documentId: document.id, documentURL: document.documentURL}), modalStore.trigger(deleteClientDocumentModal)}}>
              <Icon icon="la:skull-crossbones" />
              <span>Delete</span>
            </button>
            
          </div>
          {/each}
          {/if}
          <button type="button" class='btn variant-filled' on:click={() => {modalStore.trigger(addClientDocumentModal)}}>Upload Document</button>
        {/if}

      </svelte:fragment>
    </TabGroup>
  </div>
  <div class='flex flex-row justify-between'>
    {#if singleClient?.product?.id}
    <button type="button" class="btn variant-filled mt-8" on:click={ () => {modalStore.trigger(addAttendanceModal)}}>Add Session</button>
    {/if}
    <button type="button" class="btn variant-filled mt-8" on:click={ () => {modalStore.trigger(updateModal)}}>Update Client</button>
  </div>
  
    {/if}
</main>

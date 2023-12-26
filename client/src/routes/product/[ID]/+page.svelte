<script>
  import { queryStore, gql, mutationStore, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { TabGroup, Tab, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
  import {tabSet} from '$lib/utilsStore'
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import {auth} from '$lib/auth'
export let data
let {ID} = data
let result
const toastStore = getToastStore()
  const client = getContextClient();

  let getProduct = queryStore({
      client,
      query: gql`
        query ($id: ID!){
          product (ID: $id){
            id
            name
            description,
            price
          }
        }
      `,
      variables: {id: ID}
    });

    const deleteProduct = async ( deleteProductId ) => {
    result = mutationStore({
      client,
      query: gql`
    mutation DeleteProduct($deleteProductId: ID!) {
        deleteProduct(id: $deleteProductId) {
        id
        name
        }
    }
      `,
      variables: { deleteProductId },
    });
    await result;
    if (result.error) {
      console.error('Mutation error:', result.error);
    } else {
      const t = {
        message: `Deleted Product: ${deleteProductId}`,
        timeout: 2000
      };
      toastStore.trigger(t);
      goto('/products');
    }
  };
    
  $: isFetching = $getProduct.fetching;
  $: singleProduct = $getProduct.data?.product;
  $: deleteProductId = singleProduct?.id
  
const modalStore = getModalStore();

$: updateProductModal = {
	type: 'component',
  component: 'updateProductModal',
  props: {singleProduct: singleProduct, isFetching},
  meta: {singleProduct: singleProduct}
  
};

$: deleteProductModal = {
	type: 'confirm',
	title: 'Deleting Product',
	body: 'Are you sure you wish to proceed?',
	// TRUE if confirm pressed, FALSE if cancel pressed
	response: async (r) => !r? modalStore.close(): await deleteProduct(deleteProductId) 

  }

</script>

<main class='w-10/12 m-auto pt-8'>
  {#if isFetching}
  
    <Spinner />
  {:else if $getProduct.error}
    <p>Oh no... {$getProduct.error.message}</p>
  {:else}
  
  <div class="card p-4">
    <TabGroup class='pb-2'>
      <Tab bind:group={$tabSet} name="tab1" value={0}>
        <svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>
        Product Details
      </Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        <!-- {$tabSet === 0} -->
        <h1 class='h4 mb-1'>Id:</h1><h1 class='h5 mb-1'>{singleProduct.id}</h1>
        <h1 class='h4 mb-1'>Name:</h1><h1 class='h5 mb-1'>{singleProduct.name}</h1>
        <h1 class='h4 mb-1'>Description:</h1><h1 class='h5 mb-1'>{singleProduct.description}</h1>
        <h1 class='h4 mb-1'>Price:</h1><h1 class='h5 mb-1'>{singleProduct.price}</h1>
        {#if $auth.isAdmin}
        <button type="button" class="btn variant-filled mt-8" on:click={ () => {modalStore.trigger(deleteProductModal)}}>
          <Icon icon="la:skull-crossbones" />
          <span>Delete Product</span>
        </button>
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
  {/if}
  {#if $auth.isAdmin}
  <button type="button" class="btn variant-filled mt-4" on:click={ () => {modalStore.trigger(updateProductModal)}}>Update Product</button>
  {:else}
    <p>You do not have permission to update products.</p>
  {/if}
</main>
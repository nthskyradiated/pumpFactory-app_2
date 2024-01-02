<script>
  import { queryStore, mutationStore, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { TabGroup, Tab, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
  import {tabSet} from '$lib/utilsStore'
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import {auth} from '$lib/auth';
	import { DeleteProductDocument, ProductDocument } from '../../../generated/graphql';
export let data
let {ID} = data
let result
const toastStore = getToastStore()
  const client = getContextClient();

  let getProduct = queryStore({
      client,
      query: ProductDocument,
      variables: {id: ID}
    });

    const deleteProduct = async ( deleteProductId ) => {
    result = mutationStore({
      client,
      query: DeleteProductDocument,
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
    <p class="mb-8">Oh no... {$getProduct.error.message}</p>
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
        <div class='card p-6 my-2'>
          <h1 class='h5 mb-3'>Id:  <span>{singleProduct.id}</span></h1>
          <h1 class='h5 mb-3'>Name:  <span>{singleProduct.name}</span></h1>
          <h1 class='h5 mb-3'>Description:  <span>{singleProduct.description}</span></h1>
          <h1 class='h5 mb-3'>Price:  <span>{singleProduct.price}</span></h1>
          <h1 class='h5 mb-3 my-3'>Product Type:  <span>{singleProduct.productType}</span></h1>
          {#if singleProduct.productType !=='EVENT'}
          <h1 class='h5 mb-3'>Expiry in days:  <span>{singleProduct.expiresIn}</span></h1>
          {#if singleProduct.productType ==='SESSION_BASED'}
          <h1 class='h5 mb-3'>Session days:  <span>{singleProduct.sessionCounter}</span></h1>
          {/if}
          {/if}
          {#if $auth.isAdmin}
          <button type="button" class="btn variant-filled mt-8" on:click={ () => {modalStore.trigger(deleteProductModal)}}>
            <Icon icon="la:skull-crossbones" />
            <span>Delete Product</span>
          </button>
          {/if}
        </div>
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
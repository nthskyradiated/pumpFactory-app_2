<script lang='ts'>
  import { queryStore, getContextClient } from '@urql/svelte';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues, Paginator, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import {productID} from '$lib/productStore'
  import {auth} from '$lib/auth'
  import { goto, preloadData } from '$app/navigation';
	import { ProductsDocument } from '../../generated/graphql';
 
  const modalStore = getModalStore();
  const client = getContextClient();

  const getProducts = queryStore({
    client,
    query: ProductsDocument
  });


  let isFetching = $getProducts.fetching;
  let products = $getProducts.data?.products || [];

  $: {
    isFetching = $getProducts.fetching;
    products = $getProducts.data?.products || [];
  }
  
  let paginationSettings = {
    page: 0,
    limit: 10,
    size: products.length,
    amounts: [3,5,10],
  } 
  $: paginationSettings = {
 ...paginationSettings,
   size: products.length,

}

  $: tableSimple = {
    head: ['Name', 'Description', 'Product Type','Expiry (in days)','Price', 'Product ID'],
    body: tableMapperValues(paginatedSource, [
      'name',
      'description',
      'productType',
      'expiresIn',
      'price',
      'id',
    ]),
  };

  $: paginatedSource = products.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);

const modal : ModalSettings = {
	type: 'component',
  component: 'addProductModal'
};

const mySelectionHandler = (event: any) => {
    // Extract the ID from the 'detail' array in the event
    const ID = event.detail[5];

    productID.set(ID)

    preloadData(`/product/${ID}`)
    goto(`/product/${ID}`)
    
  };

</script>

<main class='w-10/12 m-auto pt-8'>
  <h2 class='h2 mb-5'>Product List</h2>
  {#if isFetching}
    <!-- <p>Loading...</p> -->
    <Spinner />
  {:else if $getProducts.error}
    <p class="mb-8">Oh no... {$getProducts.error.message}</p>
  {:else}
  
    {#if products.length > 0}
  
  <Table source={tableSimple} interactive={true} on:selected={mySelectionHandler} class="pb-8"/>
  
  <Paginator
    bind:settings={paginationSettings}
    showFirstLastButtons="{true}"
    showPreviousNextButtons="{true}"
    justify-between="{true}"
    class="pb-8"
  />
  {#if $auth.isAdmin}
  <button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add a Product</button>
  {:else}
    <p>You do not have permission to add products.</p>
  {/if}
    {/if}
    {/if}
</main>
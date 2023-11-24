<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../../components/Spinner.svelte';
  import { TabGroup, Tab, getModalStore } from '@skeletonlabs/skeleton';
  import {tabSet} from '$lib/utilsStore'
  import Icon from '@iconify/svelte';
export let data
let {ID} = data

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

    
    
  $: isFetching = $getProduct.fetching;
  $: singleProduct = $getProduct.data?.product;
  
const modalStore = getModalStore();

$: updateProductModal = {
	type: 'component',
  component: 'updateProductModal',
  props: {singleProduct: singleProduct, isFetching},
  meta: {singleProduct: singleProduct}
  
};

</script>

{#if isFetching}

  <Spinner />
{:else if $getProduct.error}
  <p>Oh no... {$getProduct.error.message}</p>
{:else}

<div class="card p-4 mt-8">
  <TabGroup>
    <Tab bind:group={$tabSet} name="tab1" value={0}>
      <svelte:fragment slot="lead"><Icon icon="emojione:skull" /></svelte:fragment>
      Product Details
    </Tab>
    <!-- Tab Panels --->
    <svelte:fragment slot="panel">
      {$tabSet === 0}
      <h1 class='h4 mb-1'>Id:</h1><h1 class='h5 mb-1'>{singleProduct.id}</h1>
      <h1 class='h4 mb-1'>Name:</h1><h1 class='h5 mb-1'>{singleProduct.name}</h1>
      <h1 class='h4 mb-1'>Description:</h1><h1 class='h5 mb-1'>{singleProduct.description}</h1>
      <h1 class='h4 mb-1'>Price:</h1><h1 class='h5 mb-1'>{singleProduct.price}</h1>
    </svelte:fragment>
  </TabGroup>
</div>

<button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(updateProductModal)}}>Update Product</button>

  {/if}

<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues, Paginator, getModalStore } from '@skeletonlabs/skeleton';
  import {auth} from '$lib/auth'


  export const load = async () => {
$: isAdmin = $auth.isAdmin;
    console.log('isAdmin:', isAdmin);
  };
 
  const modalStore = getModalStore();
  const client = getContextClient();

  const getProducts = queryStore({
    client,
    query: gql`
      query {
        products {
          id
          name
          description
          price
        }
      }
    `,
  });

  let isFetching = $getProducts.fetching;
  let products = $getProducts.data?.products || [];

  $: {
    isFetching = $getProducts.fetching;
    products = $getProducts.data?.products || [];
  }
  $: paginationSettings = {
 ...paginationSettings,
   size: products.length,

}

  let paginationSettings = {
	page: 0,
	limit: 10,
	size: products.length,
	amounts: [3,5,10],
} 

  $: tableSimple = {
    head: ['ID', 'Name', 'Description', 'Price'],
    body: tableMapperValues(paginatedSource, [
      'id',
      'name',
      'description',
      'price',
    ]),
  };

  $: paginatedSource = products.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);

const modal = {
	type: 'component',
  component: 'addProductModal'
};

console.log($auth.isAdmin);
console.log(isAdmin);
</script>


{#if isFetching}
  <!-- <p>Loading...</p> -->
  <Spinner />
{:else if $getProducts.error}
  <p>Oh no... {$getProducts.error.message}</p>
{:else}

  {#if products.length > 0}

<Table source={tableSimple} interactive={true}/>

<Paginator
	bind:settings={paginationSettings}
	showFirstLastButtons="{true}"
	showPreviousNextButtons="{true}"
/>
{#if $auth.isAdmin}
<button type="button" class="btn variant-filled" on:click={ () => {modalStore.trigger(modal)}}>Add a Product</button>
{:else}
  <p>You do not have permission to add products.</p>
{/if}
  {/if}
  {/if}


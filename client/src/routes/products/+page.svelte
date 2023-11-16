<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import { urqlClient } from '$lib/urql.js';
  import Spinner from '../../components/Spinner.svelte';
  import { Table, tableMapperValues } from '@skeletonlabs/skeleton';

  setContextClient(urqlClient);
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

  $: tableSimple = {
    head: ['ID', 'Name', 'Description', 'Price'],
    body: tableMapperValues(products, [
      'id',
      'name',
      'description',
      'price',
    ]),
  };
</script>

{#if isFetching}
  <!-- <p>Loading...</p> -->
  <Spinner />
{:else if $getProducts.error}
  <p>Oh no... {$getProducts.error.message}</p>
{:else}

  {#if products.length > 0}

<Table source={tableSimple} interactive={true}/>
  {/if}
{/if}

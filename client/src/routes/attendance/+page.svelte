<!-- src/routes/Dashboard.svelte -->

<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import {urqlClient} from '$lib/urql.js'
  setContextClient(urqlClient)
  const getAttendance = queryStore({
    client: getContextClient(),
    query: gql`
      query Attendance($id: ID!) {
  attendance(ID: $id) {
    id
    checkIn
    clientId
    productId
  }
}
    `,
  });
</script>

{#if $getProducts.fetching}
<p>Loading...</p>
{:else if $getProducts.error}
<p>Oh no... {$getProducts.error.message}</p>
{:else}
<ul>
  {#each $getProducts.data.products as product}
  <li>{product.name} - {product.description} - {product.price}</li>
  {/each}
</ul>
{/if}

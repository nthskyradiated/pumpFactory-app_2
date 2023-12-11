<!-- src/routes/Dashboard.svelte -->

<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import { Paginator } from '@skeletonlabs/skeleton';
  import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
  import Spinner from '../../components/Spinner.svelte';

  const client = getContextClient()

  const getAttendances = queryStore({
    client,
    query: gql`
      query {
  attendances {
    id
    checkIn
    client {
      name
    }
    product {
      name
    }
  }
}
    `,
  });

  let ID

  let isFetching = $getAttendances.fetching;
  let attendances = $getAttendances.data?.attendances || [];

//   let paginationSettings = {
// 	page: 0,
// 	limit: 10,
// 	size: attendances.length,
// 	amounts: [5,10,15],
// } 

// $: paginationSettings = {
//  ...paginationSettings,
//    size: attendances.length,

// }
$: {
    isFetching = $getAttendances.fetching;
    attendances = $getAttendances.data?.attendances || [];
  }

  let tableSimple = {
    head: ['ID', 'CheckIn', 'Client Name', 'Product Info'],
    body: tableMapperValues([
      'id',
      'checkIn',
      'client name',
      'product name',
    ]),
  };
//   $: paginatedSource = attendances.slice(
// 	paginationSettings.page * paginationSettings.limit,
// 	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
// );

console.log(attendances);
</script>

{#if isFetching}
<Spinner />
{:else if $getAttendances.error}
<p>Oh no... {$getAttendances.error.message}</p>
{#if attendances.length > 0}
  
  <Table source={tableSimple} class="pb-8"/>
  
  <!-- <Paginator
    bind:settings={paginationSettings}
    showFirstLastButtons="{true}"
    showPreviousNextButtons="{true}"
    justify-between="{true}"
    class="pb-8"
  /> -->
  {/if}
{/if}

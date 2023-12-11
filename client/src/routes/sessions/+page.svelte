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

  const mapperValues = async (source, keys) => {
  return source.map(item => {
    const row = keys.map(key => {
      // Handle nested properties
      const keyParts = key.split('.');
      let value = item;
      keyParts.forEach(part => {
        value = value[part];
      });
      return value;
    });
    return row;
  });
};


  let isFetching = $getAttendances.fetching;
 let attendances = $getAttendances.data?.attendances || [];

 let paginationSettings = {
	page: 0,
	limit: 10,
	size: attendances.length,
	amounts: [3,5,10],
} 

$: paginationSettings = {
 ...paginationSettings,
   size: attendances.length,

}


  $: {
      isFetching = $getAttendances.fetching;
      attendances = $getAttendances.data?.attendances || [];
    }
    $: tableSimple = {
    head: ['ID', 'CheckIn', 'client name', 'product info'],
    body: tableMapperValues(paginatedSource,[
      'id',
      'checkIn',
      'client.name',
      'product.name',
    ]),
  };





  $: paginatedSource = attendances.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);




// console.log(paginatedSource);
</script>
<main class='w-10/12 m-auto pt-8'>
  <h2 class='h2 mb-5'>Session History</h2>
  {#if isFetching}
  <Spinner />
  {:else if $getAttendances.error}
  <p>Oh no... {$getAttendances.error.message}</p>
  {#if attendances.length > 0}
    <Table source={tableSimple} class="pb-8"/>
    
    <Paginator
      bind:settings={paginationSettings}
      showFirstLastButtons="{true}"
      showPreviousNextButtons="{true}"
      justify-between="{true}"
      class="pb-8"
    />
    {/if}
    {/if}
  {#each attendances as attendance}
    <div class='card mb-4 p-5'>
      <h1>{attendance.checkIn}</h1>
      <h1>{attendance.client?.name}</h1>
      <h1>{attendance.product?.name}</h1>
      <h1>{attendance.id}</h1>
    </div>
    {/each}
</main>
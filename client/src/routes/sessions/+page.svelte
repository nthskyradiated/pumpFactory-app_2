<!-- src/routes/Dashboard.svelte -->

<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import { Paginator } from '@skeletonlabs/skeleton';
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
{:else if attendances.length > 0}
  <div class="table-container">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>CheckIn Date</th>
          <th>Client Name</th>
          <th>Product Info</th>
        </tr>
      </thead>
      <tbody>
        {#each paginatedSource as attendance (attendance.id)}
          <tr>
            <td>{attendance.id}</td>
            <td>{attendance.checkIn}</td>
            <td>{attendance.client.name}</td>
            <td>{attendance.product.name}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <Paginator
    bind:settings={paginationSettings}
    showFirstLastButtons="{true}"
    showPreviousNextButtons="{true}"
    justify-between="{true}"
    class="pb-8"
  />
{/if}
</main>
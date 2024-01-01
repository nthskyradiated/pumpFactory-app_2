<!-- src/routes/Dashboard.svelte -->

<script>
  import { queryStore, gql, getContextClient } from '@urql/svelte';
  import { Paginator } from '@skeletonlabs/skeleton';
  import Spinner from '../../components/Spinner.svelte';
  import Icon from '@iconify/svelte';
  const client = getContextClient()
  let searchValue = '';
  let error
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

const query = gql`
query MonthlyAttendance($month: Int!, $year: Int!) {
  monthlyAttendance(month: $month, year: $year) {
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
  `;
    const getMonthlyAttendance = async () => {
      console.log(searchValue);
    const [year, month] = searchValue.split('-').map(value => parseInt(value, 10));
    try {
      const result = await client.query(query, { year, month }).toPromise();
      const {data, error} = result
      if (data) {
        return data?.monthlyAttendance || [];
      }
      else if (error) {
        return error
      }
    } catch (error) {
      console.error('Error fetching sessions:', error.message);
      return [];
    }
  };

  let isFetching = getMonthlyAttendance.isFetching || $getAttendances.fetching;
  let attendances = getMonthlyAttendance.data?.monthlyAttendance ||  $getAttendances.data?.attendances || [];

 let paginationSettings = {
	page: 0,
	limit: 30,
	size: attendances.length,
	amounts: [5,10,20,30],
} 

$: paginationSettings = {
 ...paginationSettings,
   size: attendances.length,

}

  $: {
      isFetching = getMonthlyAttendance.isFetching || $getAttendances.fetching;
      attendances = getMonthlyAttendance.data?.monthlyAttendance ||  $getAttendances.data?.attendances || [];
    }


  $: paginatedSource = attendances.slice(
	paginationSettings.page * paginationSettings.limit,
	paginationSettings.page * paginationSettings.limit + paginationSettings.limit
);


const mySearchMonthlyHandler = async () => {
    
    try {
      const attendances = await getMonthlyAttendance();
    if (attendances){
      paginatedSource = attendances.slice(
      paginationSettings.page * paginationSettings.limit,
      paginationSettings.page * paginationSettings.limit + paginationSettings.limit
    );
      console.log(attendances);
      return attendances
    }
    } catch (error) {
      console.error('Error in search handler:', error.message);
      throw new Error(error.message);
    }
  };
</script>
<main class='w-10/12 m-auto pt-8'>
  <div class="flex md:flex-row flex-col w-full justify-between mb-4 align-bottom">
    <h2 class='h2 mb-5'>Session History</h2>
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] sm:w-3/6 w-full">
      <div class="input-group-shim"><Icon icon="emojione:skull" /></div>
        <input type="month" placeholder="Enter year and month (YYYY-MM)" bind:value={searchValue} on:input={() => {mySearchMonthlyHandler}} on:keydown={(e)=> {if(e.key ==='Enter') {mySearchMonthlyHandler()}}}/>
        <button class="variant-filled-secondary w-auto" type="button" on:click={mySearchMonthlyHandler}>Submit</button>

    </div>
  </div>
  {#if isFetching}
  <Spinner />
{:else if attendances.error}
  <p class="mb-8">Oh no... {attendances.error.message}</p>
{:else if attendances.length > 0}
  <div class="table-container  pb-8">
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
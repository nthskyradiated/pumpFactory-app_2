<!-- src/routes/Dashboard.svelte -->

<script>
  import { queryStore, gql, getContextClient, setContextClient } from '@urql/svelte';
  import Spinner from '../../components/Spinner.svelte';

  const client = getContextClient()

  const getAttendances = queryStore({
    client,
    query: gql`
      query {
  attendances {
    id
    checkIn
    clientId
    productId
  }
}
    `,
  });

  console.log($getAttendances);
</script>

{#if $getAttendances.fetching}
<Spinner />
{:else if $getAttendances.error}
<p>Oh no... {$getAttendances.error.message}</p>
{:else}
<ul>
  {#each $getAttendances.data.attendances as attendance}
  <li>{attendance.clientId} - {attendance.productId} - {attendance.checkIn}</li>
  {/each}
  <!-- {$getAttendances.data?.attendance} -->
</ul>
{/if}

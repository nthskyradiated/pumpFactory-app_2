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

{#if $getAttendance.fetching}
<p>Loading...</p>
{:else if $getAttendance.error}
<p>Oh no... {$getAttendance.error.message}</p>
{:else}
<ul>
  {#each $getAttendance.data.attendance as attendance}
  <li>{attendance.clientId} - {attendance.productId} - {attendance.checkIn}</li>
  {/each}
</ul>
{/if}

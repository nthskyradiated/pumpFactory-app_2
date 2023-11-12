<!-- src/routes/Dashboard.svelte -->
<script>
    import { onMount } from 'svelte';
    import { gql, setContextClient, queryStore } from '@urql/svelte';
    import urqlClient from '../+page.svelte';
  
    let result;

    setContextClient(urqlClient);
  
    onMount(async () => {
        result = queryStore({
            client: urqlClient,
            query: gql`
        query Clients {
          clients {
            id
            name
            email
            phone
            birthdate
            age
            waiver
            membershipStatus
            product {
              id
              description
              name
            }
            attendance {
              checkIn
              clientId
            }
          }
        }
      `
        })
      // Fetch data when the component mounts
        
  
      const response = await urqlClient(result).toPromise();
      result = response.data.clients; // Update to the correct field in your response
    });
  </script>
  
  <main>
    {#if result}
      {#each result as user (user.id)}
        <h1>Welcome, {user.name}!</h1>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <!-- Display other user information as needed -->
      {/each}
    {:else}
      <p>Loading...</p>
    {/if}
  </main>
  
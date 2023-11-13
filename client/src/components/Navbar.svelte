<script>
    import { goto } from '$app/navigation';
  import { auth } from '$lib/auth';
    // Function to handle logout
    const logout = () => {
      // Clear the access token from local storage or your preferred storage mechanism
      localStorage.removeItem('token');
  
      // Navigate to the login page
      goto('/');
    };
  </script>
  
  <nav>
    {#if $auth.isLoggedIn}
      <!-- Links for logged-in users -->
      <a on:click={() => goto('/clients')}>Clients</a>
      <a on:click={() => goto('/products')}>Products</a>
      <a on:click={() => goto('/attendance')}>Attendance</a>
      <a on:click={() => goto('/me')}>Profile</a>
      <a on:click={logout}>Logout</a>
    {:else}
      <!-- Links for not logged-in users -->
      <a href="/register">Register</a>
    {/if}
  </nav>
  
  <style>
    nav {
      background-color: #333;
      padding: 10px;
      display: flex;
      justify-content: space-around;
    }
  
    a {
      color: white;
      text-decoration: none;
    }
  </style>
  
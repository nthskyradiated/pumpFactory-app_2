<script>
  import "../app.postcss";
  import { urqlClient } from '$lib/urql.js';
  import { setContextClient } from '@urql/svelte';
  import { AppShell, AppBar,LightSwitch, initializeStores, Modal } from '@skeletonlabs/skeleton';
  import AddClientModal from "../components/AddClientModal.svelte";
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import Footer from "../components/Footer.svelte";

  initializeStores()
  setContextClient(urqlClient);

  const modalRegistry = {
    addClientModal: {ref: AddClientModal}
  }
const currentRoute = writable('');

  onMount(() => {
    const unsubscribe = location.subscribe((value) => {
      // Update the currentRoute store whenever the route changes
      currentRoute.set(value.pathname);
    });

    return () => {
      // Cleanup the subscription when the component is destroyed
      unsubscribe();
    };
  });

  function handleLogout() {
    // Perform logout logic here
    // For example, clear tokens, navigate to login page, etc.
    goto('/');
  }


</script>

<Modal components={modalRegistry} />
<AppShell>
  <AppBar>
    <LightSwitch />
    <svelte:fragment slot="header">Header</svelte:fragment>
    <svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
    <nav>
      <!-- {#if $route.path.startsWith('/dashboard')} -->
      <a href="/products">Products</a>
      <a href="/attendance">Attendance</a>
      <a href="/dashboard">Clients</a>
      <a href="/#" on:click={handleLogout}>Logout</a>
      <!-- {/if} -->
    </nav>
  </AppBar>
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />

	<Footer />
</AppShell>
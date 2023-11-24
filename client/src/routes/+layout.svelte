<script>
  import "../app.postcss";
  import { urqlClient } from '$lib/urql.js';
  import { setContextClient } from '@urql/svelte';
  import { AppShell, AppBar,LightSwitch, initializeStores, Modal } from '@skeletonlabs/skeleton';
  import AddClientModal from "../components/AddClientModal.svelte";
  import AddProductModal from "../components/AddProductModal.svelte";
  import UpdateProductModal from "../components/UpdateProductModal.svelte";
  import UpdateClientModal from "../components/UpdateClientModal.svelte";
  import { goto } from '$app/navigation';
  import Footer from "../components/Footer.svelte";

  initializeStores()
  setContextClient(urqlClient);

  const modalRegistry = {
    addClientModal: {ref: AddClientModal},
    updateClientModal: {ref: UpdateClientModal},
    addProductModal: {ref: AddProductModal},
    updateProductModal: {ref: UpdateProductModal}
  }

  function handleLogout() {
    // Perform logout logic here
    localStorage.removeItem('token');
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
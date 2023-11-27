<script>
  import "../app.postcss";
  import { urqlClient } from '$lib/urql.js';
  import { setContextClient } from '@urql/svelte';
  import { AppShell, AppBar,LightSwitch, initializeStores, Modal, Toast } from '@skeletonlabs/skeleton';
  import AddClientModal from "../components/AddClientModal.svelte";
  import AddProductModal from "../components/AddProductModal.svelte";
  import UpdateProductModal from "../components/UpdateProductModal.svelte";
  import UpdateClientModal from "../components/UpdateClientModal.svelte";
  import { goto } from '$app/navigation';
  import Footer from "../components/Footer.svelte";
  import Logo from '../components/Logo.svelte'
  import {page} from '$app/stores'

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
<Toast />

<AppShell slotPageFooter slotPageHeader class='relative m-auto'>
    <svelte:fragment slot="pageHeader">
    <AppBar slotTrail='flex flex-row justify-end' gap-8 slotLead class='w-10/12 m-auto'>
      <svelte:fragment slot="lead">
      <LightSwitch />
      <Logo />
      <h1>Pump Factory App</h1>
      </svelte:fragment>
      <svelte:fragment slot="trail">
          <nav class='text-xl'>
              {#if $page.url.pathname !== '/'}
              <a href="/products">Products</a>
              <!-- <a href="/attendance">Attendance</a> -->
              <a href="/dashboard">Clients</a>
              <a href="/#" on:click={handleLogout}>Logout</a>
              {/if}
            </nav>

        </svelte:fragment>
      </AppBar>
    </svelte:fragment>
    <slot />
    <svelte:fragment slot="pageFooter">
      <Footer />
    </svelte:fragment>
  </AppShell>

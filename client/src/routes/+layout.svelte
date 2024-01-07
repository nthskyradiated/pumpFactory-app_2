<script>
  import "../app.postcss";
  import { urqlClient } from '$lib/urql.js';
  import { setContextClient } from '@urql/svelte';
  import { AppShell, AppBar,LightSwitch, initializeStores, Modal, Toast } from '@skeletonlabs/skeleton';
  import AddClientModal from "../components/AddClientModal.svelte";
  import AddProductModal from "../components/AddProductModal.svelte";
  import UpdateProductModal from "../components/UpdateProductModal.svelte";
  import UpdateClientModal from "../components/UpdateClientModal.svelte";
  import AddClientDocumentModal from "../components/AddClientDocumentModal.svelte";
  import UploadWaiverModal from "../components/UploadWaiverModal.svelte";
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
    updateProductModal: {ref: UpdateProductModal},
    addClientDocumentModal: {ref: AddClientDocumentModal},
    uploadWaiverModal: {ref: UploadWaiverModal}
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
    <AppBar slotTrail gap-8 slotLead class='w-10/12 m-auto flex '>
      <svelte:fragment slot="lead">
        <LightSwitch />
        <div class="flex justify-between sm:flex-row flex-col items-center">
        <Logo />
        <h2 class='h2'>Pump App</h2>
      </div>
      </svelte:fragment>
      <svelte:fragment slot="trail">
          <nav class='text-xl flex align-text-bottom flex-col md:flex-row'>
              {#if $page.url.pathname !== '/'}
              <a class='mr-4' href="/products">Products</a>
              <a class='mr-4' href="/sessions">Sessions</a>
              <a class='mr-4' href="/dashboard">Clients</a>
              <a class='mr-4' href="/#" on:click={handleLogout}>Logout</a>
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

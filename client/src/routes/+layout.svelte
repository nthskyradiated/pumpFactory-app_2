<script>
  import "../app.postcss";
  import { AppShell, AppBar,LightSwitch } from '@skeletonlabs/skeleton';
</script>

<AppShell>
  <AppBar>
    <LightSwitch />
    <svelte:fragment slot="header">Header</svelte:fragment>
    <svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
  </AppBar>
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
	<!-- (footer) -->
</AppShell>
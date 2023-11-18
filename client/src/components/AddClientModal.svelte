<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import { mutationStore, queryStore, gql, getContextClient } from '@urql/svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let parent: SvelteComponent;

	const client = getContextClient();

	const getProducts = queryStore({
    client,
    query: gql`
      query {
        products {
          id
          name
          description
          price
        }
      }
    `,

  });

  let products = $getProducts.data?.products || [];
  $: products = $getProducts.data?.products || [];
	const modalStore = getModalStore();

	const formData = {
		name: '',
		tel: '',
		email: '',
		birthDate: '',
		product: ''
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? 'Register a New Customer'}</header>
		<article>{$modalStore[0].body ?? 'Fill in below details'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}" on:submit|preventDefault={addClient}>
			<label class="label">
				<span>Name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<label class="label">
				<span>Phone Number</span>
				<input class="input" type="tel" bind:value={formData.tel} placeholder="Enter phone..." />
			</label>
			<label class="label">
				<span>Email</span>
				<input class="input" type="email" bind:value={formData.email} placeholder="Enter email address..." />
			</label>
			<label class="label">
				<span>Birthdate</span>
				<input class="input" type="date" bind:value={formData.birthDate} />
			</label>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label">
					<span>Product</span>	
					<select class="select">
						{#each products as product (product.id)}
						<option value={product.id}>{product.name}</option>
						{/each}
						<option value="NA">N/A</option>
					</select>
			</label>
			<label class="flex items-center space-x-2">
				<input class="radio" type="radio" checked name="radio-direct" value="1" />
				<p>Waiver (signed)</p>
			</label>
			<label class="flex items-center space-x-2">
				<input class="radio" type="radio" name="radio-direct" value="2" />
				<p>No Waiver</p>
			</label>
			
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Register</button>
    </footer>
	</div>
{/if}









let result;

const addClient = ({ id, title }) => {
  result = mutationStore({
	client,
	query: gql`
mutation AddClient($input: AddClientInput!, $productId: ID) {
  addClient(input: $input, productId: $productId) {
    id
    name
    email
    phone
    birthdate
    age
    waiver
    membershipStatus
    product {
      name
      description
      price
    }
  }
}
	`,
	variables: { input, productId },
  });
};
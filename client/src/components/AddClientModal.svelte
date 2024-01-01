<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import {  queryStore, gql, getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import {goto} from '$app/navigation'

	export let parent: SvelteComponent;
	
	const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Please fill in all required fields"

		const query = gql`
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
		  variables: { input, productId },
		`
		const addClient = async ({ input, productId }) => {
		const result = await client
		.mutation(query, {input, productId})
		.toPromise()
		.then()
		return result
	}
  
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
  
	// let products = $getProducts.data?.products || [];
	$: products = $getProducts.data?.products || [];
  
	let formData = {
	  name: '',
	  phone: '',
	  email: '',
	  birthdate: '',
	  waiver: '',
	};
	let formProduct = {
	  product: 'NA', // Default to 'NA'

	};

// Function to check if all required fields are filled
function areFieldsFilled() {
  return (
    formData.name.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.birthdate.trim() !== '' &&
    formData.waiver !== null
  );
}

const modalStore = getModalStore();
async function onFormSubmit() {
  try {
	if (!areFieldsFilled()) {
	  return visible = true
    }
    // If product is 'NA', set productId to null
    const productId = formProduct.product === 'NA' ? null : formProduct.product;

    const result = await addClient({ input: formData, productId })
		const {error, data}	= result
		if (error) {
			modalStore.close();
			console.error('Mutation error:', error.message);
				const t = {
				message: error.message,
				timeout: 2000
				};
			toastStore.trigger(t);
	
		} else {
		  // If successful, close the modal
		  if (data) {
			  modalStore.close();
			  console.log(data);
			$modalStore[0]?.response(result);
			goto('/dashboard');
		  }
		}
	} catch (error) {
    console.error('Unexpected error:', error);
  }
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
	  <form class="modal-form {cForm}">
		<label class="label">
		  <span>Name</span>
		  <input class="input" type="text" bind:value={formData.name} required placeholder="Enter name..." />
		</label>
		<label class="label">
		  <span>Phone Number</span>
		  <input class="input" type="tel" bind:value={formData.phone} required placeholder="Enter phone..." />
		</label>
		<label class="label">
		  <span>Email</span>
		  <input class="input" type="email" bind:value={formData.email} required placeholder="Enter email address..." />
		</label>
		<label class="label">
		  <span>Birthdate</span>
		  <input class="input" type="date" required bind:value={formData.birthdate} />
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
		  <span>Product</span>
		  <select class="select" bind:value={formProduct.product}>
			{#each products as product (product.id)}
			<option value={product.id}>{product.name}</option>
			{/each}
			<option value="NA">N/A</option>
		  </select>
		</label>
		<label class="flex items-center space-x-2">
		  <input class="radio" type="radio" required checked name="radio-direct" value={true} bind:group={formData.waiver}/>
		  <p>Waiver (signed)</p>
		</label>
		<label class="flex items-center space-x-2">
		  <input class="radio" type="radio" name="radio-direct" value={false} bind:group={formData.waiver}/>
		  <p>No Waiver</p>
		</label>
	  </form>
	  <!-- prettier-ignore -->
	  <footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Register</button>
	  </footer>
	</div>


{#if visible}
<aside class="alert variant-filled-surface z-10 fixed bottom-1 right-1">
	<div class="alert-message">
		<h3 class="h3">Input values required</h3>
		<p>{message}</p>
	</div>
	<div class="alert-actions"><button type="button" class="btn-icon variant-ghost" on:click={() => {visible=false}}>X</button></div>
</aside>
{/if}
		
  {/if}
  
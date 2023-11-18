<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import { mutationStore, queryStore, gql, getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let parent: SvelteComponent;
  
	const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Please fill in all required fields"
	let result;
  
	const addClient = ({ input, productId }) => {
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

async function onFormSubmit() {
  try {

	if (!areFieldsFilled()) {
	  return visible = true
    }
    // If product is 'NA', set productId to null
    const productId = formProduct.product === 'NA' ? null : formProduct.product;
    addClient({ input: formData, productId });

    // Wait for the mutation result
    await result;

    // Check if there are errors in the result
    if (result.error) {
      // Handle the error, e.g., display an error message
      console.error('Mutation error:', result.error);
	  const t = {
	message: result.error
	};
toastStore.trigger(t);
      // Optionally, update your UI to show an error message to the user
    } else {
      // If successful, close the modal
      if (result.data) {
        $modalStore[0].response(result);
        console.log(result.data.addClient);
      }
      modalStore.close();
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    // Optionally, update your UI to show an error message to the user
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
  
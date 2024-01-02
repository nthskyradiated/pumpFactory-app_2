<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import { getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { AddProductDocument } from '../generated/graphql';

	export let parent: SvelteComponent;
  
	const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Invalid fields found. Minimum price is 100. Negative values are not allowed. Event expiry and session count should be set to zero";

	const addProduct = async ({ input }) => {
		const result = await client
		.mutation(AddProductDocument, { input})
		.toPromise()
		.then()
		return result
	}

	const modalStore = getModalStore();
  
	let formData = {
  name: '',
  description: '',
  price: 100,
  productType: 'TIME_BASED',
  expiresIn: 0 || null,
  sessionCounter: 0 || null,
};

	async function areFieldsFilled() {

	const isValidEvent =
    formData.productType === 'EVENT' &&
    (formData.sessionCounter === 0 || formData.sessionCounter === null) &&
    (formData.expiresIn === 0 || formData.expiresIn === null);

  	const isValidSessionBased =
    formData.productType === 'SESSION_BASED' &&
    formData.sessionCounter !== null &&
    formData.expiresIn !== null &&
    typeof formData.sessionCounter === 'number' &&
    typeof formData.expiresIn === 'number' &&
    formData.sessionCounter >= 1 &&  // Ensure non-negative value
    formData.expiresIn >= 1;         // Ensure non-negative value

  const isValidTimeBased =
    formData.productType === 'TIME_BASED' &&
    (formData.sessionCounter === null || formData.sessionCounter === 0)&&
    formData.expiresIn !== null &&
    typeof formData.expiresIn === 'number' &&
    formData.expiresIn >= 1;         // Ensure non-negative value

  const isPositiveNumber =
    typeof formData.price === 'number' && formData.price > 100;

  return (
    formData.name.trim() !== '' &&
    formData.description.trim() !== '' &&
    isPositiveNumber &&
    (isValidSessionBased || isValidTimeBased || isValidEvent)
  );
}

async function onFormSubmit() {
	console.log(formData);
  try {

	if (!areFieldsFilled()) {
	  return visible = true
    }

    const result = await addProduct({ input: formData });

    const {error, data} = result;

    if (error) {
		modalStore.close();
      console.error('Mutation error:', error.message);
	  const t = {
		message: error.message
		};
		toastStore.trigger(t);

    } else {
      // If successful, close the modal
      if (data) {
		  modalStore.close();
		  console.log(data);
        $modalStore[0]?.response(result);
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
	  <header class={cHeader}>{$modalStore[0].title ?? 'Register a New Product'}</header>
	  <article>{$modalStore[0].body ?? 'Fill in below details'}</article>
	  <!-- Enable for debugging: -->
	  <form class="modal-form {cForm}">
		<label class="label">
		  <span>Name</span>
		  <input class="input" type="text" bind:value={formData.name} required placeholder="Enter product name..." />
		</label>
		<label class="label">
		  <span>Price</span>
		  <input class="input" type="number" bind:value={formData.price} required placeholder="Enter product price" />
		</label>
		<label class="label">
			<span>Product Type</span>
			<select class="select" bind:value={formData.productType} required>
				<option value="SESSION_BASED">Session-based</option>
				<option value="TIME_BASED">Time-based</option>
				<option value="EVENT">Event</option>
			</select>
		</label>
		<label class="label">
			<span>Expiration</span>
			<input class="input" type="number" bind:value={formData.expiresIn} required placeholder="Enter number of days before expiration" />
		  </label>
		  <label class="label">
			<span>Session Count</span>
			<input class="input" type="number" bind:value={formData.sessionCounter} required placeholder="Enter number of sessions if applicable" />
		  </label>		
		<label class="label">
			<textarea class="textarea" rows="4" bind:value={formData.description} placeholder="Enter product description" />
		</label>


	  </form>
	  <!-- prettier-ignore -->
	  <footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Create Product</button>
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
  
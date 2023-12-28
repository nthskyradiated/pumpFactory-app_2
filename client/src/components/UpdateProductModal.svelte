<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import { mutationStore, gql, getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let parent: SvelteComponent;
  
	const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Please fill in all required fields. Minimum price value is 100."

  
	
	const query = gql`
		  mutation UpdateProduct($input: UpdateProductInput!) {
			updateProduct(input: $input) {
			  id
			  name
			  description
			  price
			  productType
    		  expiresIn
    		  sessionCounter
			}
		  }
		  variables: { input },
		`
	const updateProduct = async ({ input }) => {
		const result = await client
		.mutation(query, { input})
		.toPromise()
		.then()
		return result
	}

  
	const modalStore = getModalStore();
  
	let formData = {
		id: $modalStore[0].meta.singleProduct.id,
	  	name: "",
	  	description: "",
	  	price: $modalStore[0].meta.singleProduct.price,
		productType: $modalStore[0].meta.singleProduct.productType,
		expiresIn: $modalStore[0].meta.singleProduct.expiresIn,
		sessionCounter: $modalStore[0].meta.singleProduct.sessionCounter,
	};
	
	async function onFormSubmit() {
	const isPositiveNumber = typeof formData.price === 'number' && formData.price > 100;
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
  try {
	if (!isPositiveNumber && (!isValidSessionBased || !isValidTimeBased || !isValidEvent)) {
	  return visible = true
    }
    const input = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '' && v !== null && v !== undefined));

    const result = await updateProduct({ input });
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
	  <header class={cHeader}>{$modalStore[0].title ?? 'Update Product Information'}</header>
	  <article>{$modalStore[0].body ?? 'Fill in below details'}</article>
	  <!-- Enable for debugging: -->
	  <form class="modal-form {cForm}">
		<label class="label">
		  <span>Name</span>
		  <input class="input" type="text" bind:value={formData.name} placeholder={$modalStore[0].meta.singleProduct.name} />
		</label>
		<label class="label">
		  <span>Price</span>
		  <input class="input" type="number" bind:value={formData.price} placeholder={$modalStore[0].meta.singleProduct.price} />
		</label>
		<label class="label">
			<span>Product Type</span>
			<select class="select" bind:value={formData.productType} >
				<option value="SESSION_BASED">Session-based</option>
				<option value="TIME_BASED">Time-based</option>
				<option value="EVENT">Event</option>
			</select>
		</label>
		<label class="label">
			<span>Expiration</span>
			<input class="input" type="number" bind:value={formData.expiresIn} placeholder={$modalStore[0].meta.singleProduct.expiresIn} />
		  </label>
		  <label class="label">
			<span>Session Count</span>
			<input class="input" type="number" bind:value={formData.sessionCounter} placeholder={$modalStore[0].meta.singleProduct.sessionCounter} />
		  </label>	
		<label class="label">
			<textarea class="textarea" rows="4" bind:value={formData.description} placeholder={$modalStore[0].meta.singleProduct.description} />
		</label>


	  </form>
	  <!-- prettier-ignore -->
	  <footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Update Product</button>
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
  
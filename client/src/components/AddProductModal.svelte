<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import { gql, getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let parent: SvelteComponent;
  
	const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Please fill in all required fields. Minimum price value is 100."

		const query = gql`
		  mutation AddProduct($input: AddProductInput!) {
			addProduct(input: $input) {
			  id
			  name
			  description
			  price
			}
		  }
		  variables: { input },
		`
	const addProduct = async ({ input }) => {
		const result = await client
		.mutation(query, { input})
		.toPromise()
		.then()
		return result
	}

	const modalStore = getModalStore();
  
	let formData = {
	  name: '',
	  description: '',
	  price: 100,
	};

async function areFieldsFilled() {
const isPositiveNumber = typeof formData.price === 'number' && formData.price > 100;
  return (
    formData.name.trim() !== '' &&
    formData.description.trim() !== '' &&
    isPositiveNumber
  );
}

async function onFormSubmit() {
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
  
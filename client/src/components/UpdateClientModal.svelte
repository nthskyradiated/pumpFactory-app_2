<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import {  queryStore, gql, getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	export let parent: SvelteComponent;

	const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Please fill in all required fields"
		
		const query = gql`
		  mutation updateClient($input: UpdateClientInput!, $productId: ID) {
			updateClient(input: $input, productId: $productId) {
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
		const updateClient = async ({ input, productId }) => {
			const result = await client
		.mutation(query, {input, productId})
		.toPromise()
		.then()
		return result
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
  
	$: products = $getProducts.data?.products || [];
  
	const modalStore = getModalStore();
  
// 	let formData = {
// 	id: "",
//     name: "",
//     phone: "",
//     email: "",
//     birthdate: "",
//     waiver: false,
//   };

let formProduct = {
    product: $modalStore[0].meta.singleClient.product?.id || "NA"
  };


  let formData = {
		id: $modalStore[0].meta.singleClient.id,
      name: "",
      phone: "",
      email: "",
      birthdate: "",
      waiver: $modalStore[0].meta.singleClient.waiver
    };
//  $:  formProduct = {
//     product: $modalStore[0].meta.singleClient.product?.id || 'NA' || null || undefined
//   };
//   });

// console.log($modalStore[0]);
	

async function onFormSubmit() {
  try {

    // If product is 'NA', set productId to null
    const productId = formProduct.product === 'NA' ? null : formProduct.product;
    const result = await updateClient({ input: formData, productId });
	formProduct.product = 'NA';
	const {error, data}	= result
    // Check if there are errors in the result
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
		  }
		}
	} catch (error) {
    // Handle unexpected errors
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
	  <header class={cHeader}>{$modalStore[0].title ?? 'Update Customer Information'}</header>
	  <article>{$modalStore[0].body ?? 'Fill in below details'}</article>
	  <!-- Enable for debugging: -->
	  <form class="modal-form {cForm}">
		<label class="label">
		  <span>Name</span>
		  <input class="input" type="text" bind:value={formData.name} placeholder={$modalStore[0].meta.singleClient.name}/>
		</label>
		<label class="label">
		  <span>Phone Number</span>
		  <input class="input" type="tel" bind:value={formData.phone} placeholder={$modalStore[0].meta.singleClient.phone} />
		</label>
		<label class="label">
		  <span>Email</span>
		  <input class="input" type="email" bind:value={formData.email} placeholder={$modalStore[0].meta.singleClient.email}/>
		</label>
		<label class="label">
		  <span>Birthdate</span>
		  <input class="input" type="date" bind:value={formData.birthdate} placeholder={$modalStore[0].meta.singleClient.birthdate}>
		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
		  <span>Product</span>
		  <select class="select" bind:value={formProduct.product}>
			{#each products as product (product.id)}
			  {#if product.id === $modalStore[0].meta.singleClient.product?.id}
				<option value={product.id} selected>{product.name}</option>
			  {:else if $modalStore[0].meta.singleClient.product?.id === null && product.id === 'NA'}
				<option value="NA" selected>N/A</option>
			  {:else}
				<option value={product.id}>{product.name}</option>
			  {/if}
			  {/each}
			  <option value="NA">NA</option>
		  </select>
		</label>
		<label class="flex items-center space-x-2">
			<input class="radio" type="radio" name="radio-direct" value={true} bind:group={formData.waiver} />
			<p>Waiver (signed)</p>
		  </label>
		  
		  <label class="flex items-center space-x-2">
			<input class="radio" type="radio" name="radio-direct" value={false} bind:group={formData.waiver} />
			<p>No Waiver</p>
		  </label>
		  
	  </form>
	  <!-- prettier-ignore -->
	  <footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Update</button>
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
  
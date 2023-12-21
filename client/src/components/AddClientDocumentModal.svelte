<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import {  gql, getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';


	export let parent: SvelteComponent;
	
	const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Please fill in all required fields"

		const query = gql`
		  mutation AddClientDocument($input: AddClientDocumentInput!) {
			addClientDocument(input: $input) {
			  clientId
			  documentName
			  documentType
			  documentURL
			}
		  }
		  variables: { input },
		`
		const addClientDocument = async ({ input }) => {
		const result = await client
		.mutation(query, {input})
		.toPromise()
		.then()
		return result
	}

	const modalStore = getModalStore();
  
	let formData = {
	  clientId: $modalStore[0].meta.singleClient.id,
	  documentName: $modalStore[0].meta.singleClient.name,
	  documentType: '',
	  documentURL: '',
	  file: null
	};

// Function to check if all required fields are filled
function areFieldsFilled() {
  return (
    formData.documentType !== null &&
	formData.file !== null
  );
}

const docUpload = async () => {
  try {
    const { file } = formData;
    const form = new FormData();
    form.append('file', file);

    // Debugging: Log formData and form data before the fetch
    console.log('formData:', formData);
    console.log('Form Data before fetch:', [...form.entries()]);

    // Use fetch to upload the file to the server
    const response = await fetch('https://uploads.thepumpfactory.net/upload', {
      method: 'POST',
      body: form,

    });

    // Debugging: Log response status and response body
    console.log('Response Status:', response.status);
    // console.log('Response Body:', await response.json());

    if (response.ok) {
		const resultUpload = await response.json()
		formData.documentName = resultUpload.originalname;
		formData.documentURL = resultUpload.url
		delete formData.file
		console.log(resultUpload);
		console.log(formData);

    } else {
      console.error('File upload failed');
    }
  } catch (error) {
    console.error('Error during file upload:', error);
  }
};
  
  const handleFileChange = (event) => {
	const fileInput = event.target;
  const file = fileInput.files[0];
  if (file) {
    // Update formData with the selected file
    formData.file = file;
	console.log('Selected File:', file);
    console.log('Updated FormData:', formData);
  }
};

async function onFormSubmit() {

  try {
	if (!areFieldsFilled()) {
	  return visible = true
    }

	await docUpload();

	const result = await addClientDocument({ input: formData });
      const { error, data } = result;

      if (error) {
        modalStore.close();
        console.error('Mutation error:', error.message);
        const t = {
          message: error.message,
          timeout: 2000,
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
	  <header class={cHeader}>{$modalStore[0].title ?? 'Upload Client Documents'}</header>
	  <article>{$modalStore[0].body ?? 'Select a File to Upload'}</article>
	  <!-- Enable for debugging: -->
	  <form class="modal-form {cForm}">
		<label class="label">
		  <span>Browse Document</span>
		  <input class="input" type="file" bind:value={formData.documentName} required accept=".pdf, .png, .jpg, .bmp, .doc" on:change={handleFileChange}/>

		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<p>Document Type</p>
		<label class="flex items-center space-x-2">
		  <input class="radio" type="radio" required checked name="radio-direct" value="PHOTO" bind:group={formData.documentType}/>
		  <p>Photo</p>
		</label>
		<label class="flex items-center space-x-2">
		  <input class="radio" type="radio" name="radio-direct" value="IDENTIFICATION" bind:group={formData.documentType}/>
		  <p>Identification</p>
		</label>
		<label class="flex items-center space-x-2">
		  <input class="radio" type="radio" name="radio-direct" value="WAIVER" bind:group={formData.documentType}/>
		  <p>Waiver</p>
		</label>
	  </form>
	  <!-- prettier-ignore -->
	  <footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Upload</button>
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
  
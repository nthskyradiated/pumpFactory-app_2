<script lang="ts">
	import { signature } from '../lib/waiverUtils'
	import { SvelteComponent } from 'svelte';
	import { getContextClient } from '@urql/svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { AddClientDocumentDocument } from '../generated/graphql';

  export let parent: SvelteComponent;
  const toastStore = getToastStore();
	const client = getContextClient();
	let visible = false;
	const message = "Please fill in all required fields"
  const modalStore = getModalStore();
  
      const addClientDocument = async ({ input }) => {
      const result = await client
      .mutation(AddClientDocumentDocument, {input})
      .toPromise()
      .then()
      return result
    }

  
  // Initialize the formData with the defined interface
  let formData = {
    clientId: $modalStore[0]?.meta.singleClient.id || '',
    documentName: $modalStore[0]?.meta.singleClient.name || '',
    documentType: '',
    documentURL: '',
    file: null,
  };


	let layers: { path: string; width: number; height: number }[] = []

	let width: number
	let height: number
	let preview: string

	const ondraw = (path: string) => (preview = path)
	const oncomplete = (path: string) => {
		preview = ''
		layers = [...layers, { width, height, path }]
	}

	const clear = () => {
		layers = []
	}

  const uploadWaiver = async (file, clientId, documentName) => {
    try {
    const clientIdSuffix = clientId.slice(-5);
    const nameParts = documentName.split(' ');
    const lastName = nameParts.length > 1 ? nameParts[1] : '';
    const firstName = nameParts.length > 0 ? nameParts[0] : '';
    const fileName = `waiver-${lastName}-${firstName}-${clientIdSuffix}.html`;
    // Constructing the filename for the Blob
    const blobFileName = `waiver-${lastName}-${firstName}-${clientIdSuffix}.html`;


    const participantName = (document.getElementById('participantName') as HTMLInputElement)?.value;
    const address = (document.getElementById('address') as HTMLInputElement)?.value;
    const guardianName = (document.getElementById('guardianName') as HTMLInputElement)?.value;
    const date = (document.getElementById('date') as HTMLInputElement)?.value;
    const signatureLayer = layers.map(layer => layer.path).join('');

    const content = `
      <html>
        <head>
          <title>The Pump Factory Waiver</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
        </head>
        <body>
          <main class="w-5/6 m-auto leading-8">
            <!-- Hard-coded HTML content with participantName, guardianName, and date -->
            <h1 class='text-5xl text-center'>The Pump Factory</h1>
            <h1 class='text-2xl my-8 text-center'>Waiver and Release of Liability</h1>

<p class="text-xl uppercase leading-8">Please read this waiver and release of liability carefully before participating in any activities at The Pump Factory Rock Climbing Gym.</p>

<p class="text-xl uppercase leading-8">By signing this waiver and release of liability, you agree to release and discharge the gym, staff, or any of its owners from any and all liability arising out of your use of the facilities and participation in but not limited to rock climbing activities (i.e., Top Rope Climbing, Lead Climbing, Bouldering, etc.).</p>
<div>
		<p>I, <strong>${participantName}</strong>, of legal age, and resident of <strong>${address}</strong>, hereby acknowledge that I/my minor am/is voluntarily participating in activities at The Pump Factory Rock Climbing Gym (hereinafter “the Gym”). In consideration to use the facilities and equipment provided, I agree to the following terms and conditions:</p>


		<ol>
			<li><strong>Assumption of Risks:</strong> I understand and acknowledge that rock climbing, bouldering, and related activities involve inherent risks of injury or death, caused by but not limited to falling, equipment failure, and the actions of other participants beyond my control. I voluntarily assume all risks involved;</li>
			<li><strong>Release of Liability:</strong> I release, waive, and discharge The Pump Factory, its owners, employees, and affiliates from any and all liability, claims, demands, actions, or causes of action arising out of any loss, damage, or injury, including death, that may be sustained by me and/or my minor while participating in activities at the Gym;</li>
			<li><strong>Responsibility for Personal Property and Damage to Property:</strong> I am responsible for my and my minor’s personal property while on the premises, including the surroundings of the Gym, and I release the Gym from any liability for loss or damage to personal property. I understand that if I or my minor cause damage to any equipment or property of the gym, I may be liable for the cost of repair or replacement subject to the discretion of the management of the Gym;</li>
			<li><strong>Fitness to Participate:</strong> I hereby confirm that I/my minor am/is physically and mentally capable of participating in rock climbing activities. I have not been advised against participation by a medical professional and do not have any medical conditions or disabilities that would increase the risk associated with rock climbing. Should I fail to disclose any medical condition that I/my minor possess, I hereby assume all liability;</li>
			<li><strong>Medical Authorization:</strong> In the event of any injury or illness, I authorize the Gym staff to contact my emergency contact, seek, and consent to emergency medical treatment on my behalf. I am responsible for the safety of my minor;</li>
			<li><strong>Compliance with Rules and Regulations:</strong> I hereby agree to abide by all the rules and guidelines of the Gym and to follow the instructions of the staff in order to have a safe and enjoyable experience at the Gym.</li>
		</ol>

		<p class="text-xl uppercase mt-8 leading-8">I have carefully read and hereby waive, release, and assume all risk and voluntarily sign this waiver and release of liability agreement.</p>
    
            <p><strong>Printed Name of Participant: </strong>${participantName}</p>
            <p><strong>Printed Name of Guardian: </strong>${guardianName}</p>
            <label for="date"> 
              <strong>Signature Date: </strong>${date}
            </label>

            <!-- Signature layers -->
            <div class="relative">
              <svg viewBox="0 0 ${width || 300} ${height || 150}">
                <path d="${signatureLayer}" />
            </div>
          </main>
        </body>
      </html>
    `;

    // Uploading to pump endpoint

    const formData = new FormData();
    formData.append('file', new Blob([content], { type: 'text/html' }), blobFileName);
    formData.append('documentType', 'WAIVER'); // Set the documentType
    formData.append('documentURL', ''); // This can be left empty for now, as the URL will be obtained after upload

      const response = await fetch('https://uploads.thepumpfactory.net/upload', {
        // const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
      const resultUpload = await response.json();
      // Constructing the filename for the mutation
      const mutationFileName = `waiver-${lastName}-${firstName}-${clientIdSuffix}.html`;

      return {
        documentURL: `https://uploads.thepumpfactory.net/uploads/${mutationFileName}`,
        // documentURL: `http://localhost:3000/uploads/${mutationFileName}`,
        fileName: mutationFileName,
      };
      } else {
        console.error('File upload failed');
        return null
      }
    } catch (error) {
      console.error('Error during file upload:', error);

    }

    //code block below is for saving html locally
    // const blob = new Blob([content], { type: 'text/html' });
    // const url = URL.createObjectURL(blob);
    
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'waiver.html';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  };

  const onSubmit = async () => {
  try {
    const fileUploadResult = await uploadWaiver(formData.file, formData.clientId, formData.documentName); // Call the generateHTML function
    if (!fileUploadResult) {
      console.log('formData:', formData);
      console.error('File upload failed. Cannot proceed with mutation.');
      return;
    }

    // Use the file information in the mutation input
    const input = {
      clientId: formData.clientId,
      documentName: fileUploadResult.fileName,
      documentType: 'WAIVER',
      documentURL: fileUploadResult.documentURL,
    };
    const result = await addClientDocument({ input });
      const { error, data } = result;

      if (error) {
        modalStore.close();
        console.log(input);
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
	const cBase = 'card p-4 shadow-xl space-y-4 w-5/6';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
<div class="modal-example-form {cBase}">
  <header class={cHeader}>{$modalStore[0].title ?? 'Pump Factory Electronic Waiver'}</header>
<main class="w-5/6 m-auto leading-8">
  <p class="mt-2 text-sm text-center mb-4">Please sign on the dotted line to indicate that you agree to all the legal terms stipulated above.</p>
  <div class="relative w-full h-[360px] bg-gray-100 border border-dashed border-gray-300">
    <div class="absolute left-4 right-4 bottom-24 border-t border-dotted border-gray-300" />
    <div
      class="w-full h-full"
      use:signature={{ ondraw, oncomplete }}
      bind:clientWidth={width}
      bind:clientHeight={height}
      on:touchmove|preventDefault={() => false}
    >
      {#each layers as layer}
        <svg class="absolute w-full h-full fill-black pointer-events-none" viewBox="0 0 {layer.width} {layer.height}">
          <path d={layer.path} />
        </svg>
      {/each}
  
      {#if preview}
        <svg class="absolute w-full h-full fill-gray-900 pointer-events-none" viewBox="0 0 {width} {height}">
          <path d={preview} />
        </svg>
      {/if}
    </div>
    <button class="absolute top-2 right-2 px-4 py-2 text-sm text-gray-500 bg-white border border-gray-200" on:click={clear}>Clear</button>
  </div>
	<h1 class='text-5xl mt-16 text-center'>The Pump Factory</h1>
	<h1 class='text-2xl my-8 text-center'>Waiver and Release of Liability</h1>

	<p class="text-xl uppercase leading-8 mb-4">Please read this waiver and release of liability carefully before participating in any activities at The Pump Factory Rock Climbing Gym.</p>

	<p class="text-xl uppercase leading-8 mb-4">By signing this waiver and release of liability, you agree to release and discharge the gym, staff, or any of its owners from any and all liability arising out of your use of the facilities and participation in but not limited to rock climbing activities (i.e., Top Rope Climbing, Lead Climbing, Bouldering, etc.).</p>

	<div>
		<p>I,
			<input type="text" required placeholder="enter full name" class="w-1/4 pl-2 input" id='participantName'/>, of legal age, and resident of <input type="text" required placeholder="enter complete address" class="input w-96 pl-2" id='address'/>, hereby acknowledge that I/my minor am/is voluntarily participating in activities at The Pump Factory Rock Climbing Gym (hereinafter “the Gym”). In consideration to use the facilities and equipment provided, I agree to the following terms and conditions:</p>


		<ol>
			<li><strong>Assumption of Risks:</strong> I understand and acknowledge that rock climbing, bouldering, and related activities involve inherent risks of injury or death, caused by but not limited to falling, equipment failure, and the actions of other participants beyond my control. I voluntarily assume all risks involved;</li>
			<li><strong>Release of Liability:</strong> I release, waive, and discharge The Pump Factory, its owners, employees, and affiliates from any and all liability, claims, demands, actions, or causes of action arising out of any loss, damage, or injury, including death, that may be sustained by me and/or my minor while participating in activities at the Gym;</li>
			<li><strong>Responsibility for Personal Property and Damage to Property:</strong> I am responsible for my and my minor’s personal property while on the premises, including the surroundings of the Gym, and I release the Gym from any liability for loss or damage to personal property. I understand that if I or my minor cause damage to any equipment or property of the gym, I may be liable for the cost of repair or replacement subject to the discretion of the management of the Gym;</li>
			<li><strong>Fitness to Participate:</strong> I hereby confirm that I/my minor am/is physically and mentally capable of participating in rock climbing activities. I have not been advised against participation by a medical professional and do not have any medical conditions or disabilities that would increase the risk associated with rock climbing. Should I fail to disclose any medical condition that I/my minor possess, I hereby assume all liability;</li>
			<li><strong>Medical Authorization:</strong> In the event of any injury or illness, I authorize the Gym staff to contact my emergency contact, seek, and consent to emergency medical treatment on my behalf. I am responsible for the safety of my minor;</li>
			<li><strong>Compliance with Rules and Regulations:</strong> I hereby agree to abide by all the rules and guidelines of the Gym and to follow the instructions of the staff in order to have a safe and enjoyable experience at the Gym.</li>
		</ol>

		<p class="text-2xl uppercase mt-8 leading-10 text-center">I have carefully read and hereby waive, release, and assume all risk and voluntarily sign this waiver and release of liability agreement.</p>

    
		<p><strong>Printed Name of Participant: </strong><input type="text" required placeholder="Full name of participant" id='participantName' class="w-72 pl-2 my-8 input"/></p>
		<p><strong>Printed Name of Guardian: </strong><input type="text" required placeholder="Full name of guardian" class="w-72 pl-2 mb-8 input" id='guardianName'/></p>
		<label for="date"> 
		<strong class="pr-16">Date of Signature: </strong><input type="date" required placeholder="date" title="Input (date)" id="date" class='input w-1/6 mb-8'/>
		</label>
	</div>

  <footer class="modal-footer {parent.regionFooter}">
		<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		<button class="btn {parent.buttonPositive}" on:click={onSubmit}>Submit Waiver</button>
	  </footer>
  
  <!-- <div class="relative">
    {#each layers as layer}
      <svg class="absolute fill-black" viewBox="0 0 {layer.width * 2} {layer.height * 2}">
        <path d={layer.path} />
      </svg>
    {/each}
  </div> -->

</main>
</div>
{/if}

export const uploadWaiver = async (file: null, clientId: string, documentName: string, layers: any, width: number, height: number, preview: string) => {
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
  const signatureLayer = layers.map((layer: { path: any; }) => layer.path).join('');

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
    <li><strong>Consent to Use Photographic and Video Material:</strong> I hereby consent to the use of all photographic or video material pertaining to my participation within the Gym during any activity deemed part of the Gym at any time in the present or future;</li>
    <li><strong>Right to Refuse:</strong> The management, owners, employees, and affiliates reserves the right to refuse entry to any person, or cancel any person’s entry should that person be found disobeying any rules and guidelines of the Gym;</li>
    
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
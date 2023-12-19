
export const isValidURL = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
}

export const isValidFileExtension = (documentType, fileName) => {
    // Map document types to valid file extensions
    const validExtensions = {
      WAIVER: ['pdf', 'doc'],
      IDENTIFICATION: ['png', 'jpg', 'bmp', 'pdf'],
      PHOTO: ['jpg', 'png', 'bmp'],
    };
  
    const extension = fileName.split('.').pop().toLowerCase();
    return validExtensions[documentType].includes(extension);
  }
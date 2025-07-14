import { useState } from 'react';

// Cambia esta constante con tu propia API key de ImgBB
const IMGBB_API_KEY = '6d65bedf8f1cecae87cbff9e5928826f';

export function useImgBBUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async (base64Image) => {
  setUploading(true);
  setError(null);
  setImageURL(null);

  if (!base64Image) {
    setError('No se recibió ninguna imagen');
    console.error('❌ No se recibió ninguna imagen');
    setUploading(false);
    return null;
  }

  console.log('📷 Imagen base64 recibida:', base64Image.substring(0, 100), '...');

  try {
    const formData = new FormData();
    formData.append('image', base64Image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('Resultado de ImgBB:', result); // <-- Agrega este log para depuración

    if (result.success) {
      setImageURL(result.data.url);
      return result.data.url;  // <-- retorna URL aquí
    } else {
      throw new Error(result.error?.message || 'Error desconocido al subir imagen');
    }
  } catch (err) {
    setError(err.message);
    return null;
  } finally {
    setUploading(false);
  }
};

  return {
    uploadImage,
    uploading,
    imageURL,
    error,
  };
}
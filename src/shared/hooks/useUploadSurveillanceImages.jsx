// hooks/useUploadSurveillanceImages.js
import { useCallback } from 'react';
import { useSurveillance } from '../../context/SurveillanContext';
import { useImgBBUploader } from '../../shared/hooks';

export const useUploadSurveillanceImages = () => {
  const {
    originalImageBase64,
    generatedImageBase64,
    setReportImageURL,
    setReportImageGenerated,
  } = useSurveillance();

  const { uploadImage } = useImgBBUploader();

  const cleanBase64 = (base64) =>
    base64.replace(/^data:image\/\w+;base64,/, '');

  const uploadBoth = useCallback(async () => {
    if (!originalImageBase64 || !generatedImageBase64) {
      console.warn('⚠️ Imágenes no disponibles para subir.');
      return { error: true, msg: 'Ambas imágenes deben estar definidas' };
    }

    try {
  const [originalURL, generatedURL] = await Promise.all([
    uploadImage(cleanBase64(generatedImageBase64)),
    uploadImage(cleanBase64(originalImageBase64)),
  ]);

  setReportImageURL(originalURL);
  setReportImageGenerated(generatedURL);
  return { success: true };
} catch (error) {
  console.error('❌ Error subiendo imágenes:', error);
  return {
    error: true,
    msg: 'Error al subir imágenes',
    details: error
  };
}
  }, [
    originalImageBase64,
    generatedImageBase64,
    uploadImage,
    setReportImageURL,
    setReportImageGenerated,
  ]);

  return { uploadBoth };
};

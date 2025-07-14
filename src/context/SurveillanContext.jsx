import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useSaveReport } from '../shared/hooks'; // Ajusta ruta

const SurveillanceContext = createContext();

export const SurveillanceProvider = ({ children }) => {
  const [reportImageURL, setReportImageURL] = useState(null);
  const [reportImageGenerated, setReportImageGenerated] = useState(null);
  const [originalImageBase64, setOriginalImageBase64] = useState(null);
  const [generatedImageBase64, setGeneratedImageBase64] = useState(null);
  const [authorization, setAuthorization] = useState(false);


  const { saveReport, loading, error, response } = useSaveReport();

  // Ref para asegurar que solo se guarde 1 vez
  const hasSaved = useRef(false);

  useEffect(() => {
    // Condiciones para enviar:
    // ejemplo: email válido, imagen original o reportImageURL presente, autorización true
    if (
      !hasSaved.current &&
      
      (originalImageBase64 || reportImageURL) &&
      authorization
    ) {
      const reportData = {

        img: reportImageURL,
        result: reportImageGenerated,
        status: true,
      };

      saveReport(reportData).then((result) => {
        if (!result.error) {
          hasSaved.current = true; // marca que ya guardamos
          console.log('Reporte guardado exitosamente');
        } else {
          console.error('Error al guardar reporte:', result.msg);
          console.log(reportData);
        }
      });
    }
  }, [
    originalImageBase64,
    reportImageURL,
    reportImageGenerated,
    generatedImageBase64,
    authorization,
    saveReport,
  ]);

  return (
    <SurveillanceContext.Provider
      value={{
        reportImageURL,
        setReportImageURL,
        reportImageGenerated,
        setReportImageGenerated,
        originalImageBase64,
        setOriginalImageBase64,
        generatedImageBase64,
        setGeneratedImageBase64,
        authorization,
        setAuthorization,
        loading,
        error,
        response,
      }}
    >
      {children}
    </SurveillanceContext.Provider>
  );
};

export const useSurveillance = () => useContext(SurveillanceContext);



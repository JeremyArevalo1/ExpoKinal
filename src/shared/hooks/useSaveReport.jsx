import { useState, useCallback } from 'react';
import { saveReports } from '../../services/api'; // Ajusta la ruta si es necesario

export const useSaveReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const save = useCallback(async (reportData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const result = await saveReports(reportData);

    if (result.error) {
      setError(result.msg || 'Error al guardar el reporte');
    } else {
      setResponse(result.data);
    }

    setLoading(false);
    return result;
  }, []);

  return {
    saveReport: save,
    loading,
    error,
    response,
  };
};

export function useHaveIBeenPwned(){
   const checkEmail = async (email) => {
    try {
      console.log("Iniciando verificación de email:", email);
      
      const url = `https://api.xposedornot.com/v1/breach-analytics?email=${email}`;
      console.log("URL de la petición:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error al parsear la respuesta:", parseError);
      }

      const brechas = (data?.ExposedBreaches?.breaches_details || []).map((brecha) => ({
        breach: brecha.breach || "",
        details: brecha.details || "",
        logo: brecha.logo || "",
        xposed_date: brecha.xposed_date || "",
        xposed_records: brecha.xposed_records || "",
        xposed_data: brecha.xposed_data || ""
      }));

      return { 
        ExposedBreaches: { 
          breaches_details: brechas,
          BreachMetrics: data.BreachMetrics
        }
      };

    } catch (error) {
      console.error("Error general en checkEmail:", error);
      return { ExposedBreaches: { breaches_details: [] } };
    }
  };

  return { checkEmail };
};

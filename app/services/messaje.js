import { request as apiRequest } from "./services/request.js"; // asegúrate que la ruta sea correcta

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#probarApi'); // botón para probar API
  if (!btn) return; // si el botón no existe, no hacemos nada

  btn.addEventListener('click', async () => {
    try {
      // Ejemplo de solicitud GET a un endpoint (asegúrate que exista en tu backend)
      const data = await apiRequest('GET', '/api/does-not-exist'); 
      console.log('Datos recibidos:', data);
      alert('Datos recibidos. Revisa la consola.');
    } catch (error) {
      console.error('Error en la API:', error);
      alert(`Ocurrió un error al contactar la API: ${error.message}`);
    }
  });
});

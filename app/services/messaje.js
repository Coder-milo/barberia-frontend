    // src/main.js
    import { apiRequest } from './services/apiRequest';

    // Esperamos que el DOM se cargue completamente
    document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#probarApi');  // Seleccionamos el botón

    btn.addEventListener('click', async () => {
        try {
        // Intentamos hacer una solicitud GET a una ruta que no existe
        const data = await apiRequest('GET', 'api/does-not-exist');
        console.log('Datos recibidos:', data);
        } catch (error) {
        console.error('Error en la API:', error);
        }
    });
    });

    // src/services/apiRequest.js
    // intalar en la terminal: npm install sweetalert2
    import Swal from 'sweetalert2';  // Importar SweetAlert2

    const apiUrl = 'http://localhost:3000/'; // La URL de tu backend

    // Función para hacer peticiones API
    export async function apiRequest(method, endpoint = '', body = null) {
    try {
        const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        };

        // Si hay un cuerpo (como en un POST), agregarlo a la solicitud
        if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
        }

        // Realizamos la solicitud
        const response = await fetch(`${apiUrl}${endpoint}`, options);

        // Si la respuesta no es exitosa, lanzamos un error
        if (!response.ok) throw {
        status: response.status,
        statusText: response.statusText,
        };

        // Parseamos la respuesta JSON
        const json = await response.json();
        return json;

    } catch (error) {
        // Si ocurre un error, mostramos un mensaje usando SweetAlert2
        const message = error.statusText || "Ha ocurrido un error";
        Swal.fire({
        icon: 'error',
        title: `Error ${error.status || ''}`,
        text: message,
        });
        throw error;  // Volver a lanzar el error para manejarlo más tarde si es necesario
    }
    }

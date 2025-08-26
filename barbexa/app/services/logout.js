    import Swal from 'sweetalert2';
    import { logoutUser } from './storage.js';   // Función que borra token/localStorage
    import { navegation } from '../router.js';   // Función para redirigir en tu app

    export function btnLogout() {
    const logOutBtn = document.querySelector('.log-out-btn');
    if (!logOutBtn) return;

    logOutBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        // Cambia este endpoint 
        const logoutEndpoint = 'api/logout'; 

        try {
        if (logoutEndpoint) {
            await fetch(logoutEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si usas token, lo envías aquí, por ejemplo:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            });
        }

        logoutUser();  // Borra token o datos de sesión del frontend

        await Swal.fire({
            icon: 'success',
            title: 'Hasta pronto',
            text: 'Has cerrado sesión correctamente',
            timer: 2000,
            showConfirmButton: false
        });

        navegation('/');  // Redirige a home u otra ruta

        } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cerrar sesión correctamente',
        });
        console.error('Error en logout:', error);
        }
    });
    }

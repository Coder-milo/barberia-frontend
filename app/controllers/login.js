// app/js/login.js
import { login, getUserLogged } from "../services/auth.js";
import { navigation } from "../router.js";

document.addEventListener("DOMContentLoaded", () => {
  // Selecciona el formulario por ID (asegúrate de poner id="loginForm" en tu HTML)
  const form = document.querySelector("#loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarga de página

    // Obtiene valores de inputs
    const email = form.querySelector('input[name="email"]').value.trim();
    const pass = form.querySelector('input[name="password"]').value.trim();

    if (!email || !pass) {
      alert("Por favor ingresa tu usuario y contraseña.");
      return;
    }

    try {
      // Llamada al backend para login
      await login({ email, pass });

      // Obtener usuario logueado para saber su rol
      const user = await getUserLogged();

      if (!user) throw new Error("Usuario no encontrado");

      // Redirigir según rol
      switch (user.rol) {
        case "administrador":
          navigation("/dashboard");
          break;
        case "barbero":
          navigation("/barbero");
          break;
        case "cliente":
          navigation("/cliente");
          break;
        default:
          navigation("/login");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al iniciar sesión");
    }
  });
});

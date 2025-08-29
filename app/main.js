// app/main.js
import { request } from "./services/request.js";
import { navigation, navigationTag } from "./router.js";

window.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");
  app.innerHTML = "<h1>Cargando...</h1>";

  navigationTag();

  const currentPath = location.pathname || "/";

  try {
    // Verificar si hay usuario logueado
    const response = await request("/profile", "GET");
    const user = response?.user || null;

    await navigation(currentPath);
  } catch (error) {
    console.warn("No hay sesión activa:", error);
    await navigation(currentPath); // mantiene ruta pública
  }
});

// src/router.js
import { getUserLogged } from "./services/auth.js";

// Rutas a vistas
const routes = {
  "/": "/app/pages/index.html",
  "/login": "/app/pages/login.html",
  "/register": "/app/pages/register.html",
  "/barbero": "/app/pages/barbero.html",
  "/cliente": "/app/pages/cliente.html",
  "/dashboard": "/app/pages/dashboard.html",
  "/404": "/app/pages/404.html",
};

// Controladores JS (si los usas)
const controllers = {
  "/": "./controllers/index.js",
  "/login": "./controllers/login.js",
  "/register": "./controllers/register.js",
  "/dashboard": "./controllers/dashboard.js",
  "/barbero": "./controllers/barbero.js",
  "/cliente": "./controllers/cliente.js",
  "/404": "./controllers/404.js",
};

// Reglas de acceso
const guards = {
  "/login": (user) => !user,
  "/register": (user) => !user,
  "/dashboard": (user) => user?.rol === "administrador",
  "/barbero": (user) => user?.rol === "barbero",
  "/cliente": (user) => user?.rol === "cliente",
};

const app = document.getElementById("app");

// Carga vista + controlador
export async function loadView(path) {
  const view = routes[path] || routes["/404"];
  try {
    const response = await fetch(view);
    if (!response.ok) throw new Error(`Error al cargar la vista: ${view}`);
    const viewContent = await response.text();
    app.innerHTML = viewContent;

    if (controllers[path]) {
      const module = await import(controllers[path]);
      if (module?.init) module.init();
    }
  } catch (error) {
    console.error(error);
    app.innerHTML = `<h1>Error inesperado al cargar la vista.</h1>`;
  }
}

// Chequea acceso
function checkAccess(path, user) {
  const guard = guards[path];
  if (guard && !guard(user)) {
    if (path === "/login" && user) {
      switch (user.rol) {
        case "administrador": return "/dashboard";
        case "barbero":       return "/barbero";
        case "cliente":       return "/cliente";
        default:              return "/404";
      }
    }
    return user ? "/404" : "/login";
  }
  return path;
}

// Navegación (AHORA ASYNC)
export async function navigation(path) {
  // Espera al backend (cookie) para saber el rol
  const user = await getUserLogged();
  const accessRoute = checkAccess(path, user);
  if (!accessRoute) return;

  if (location.pathname !== accessRoute) {
    history.pushState(null, null, accessRoute);
  }
  await loadView(accessRoute);
}

// back/forward del navegador
window.addEventListener("popstate", () => {
  // No hacemos pushState aquí; solo renderizamos lo que hay en la URL
  loadView(location.pathname);
});

// links con data-link
export function navigationTag() {
  document.addEventListener("click", (event) => {
    const elemento = event.target.closest("[data-link]");
    if (!elemento) return;
    event.preventDefault();

    const path = elemento.getAttribute("href") || elemento.getAttribute("data-link");
    if (path) navigation(path);
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  navigationTag();
  navigation(location.pathname);
});

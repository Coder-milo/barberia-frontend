// src/router.js
import { getUserLogged } from "./services/auth.js";

// Rutas a vistas
const routes = {
  "/":          "/app/pages/landing.html",
  "/login":     "/app/pages/login.html",
  "/register":  "/app/pages/register.html",
  "/barbero":   "/app/pages/barbero.html",
  "/cliente":   "/app/pages/cliente.html",
  "/dashboard": "/app/pages/dashboard.html",
  "/404":       "/app/pages/404.html",
};

// Controladores JS (opcional)
const controllers = {
  "/": "./controllers/landing.js",
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

// Carga vista + controlador + CSS
export async function loadView(path) {
  const view = routes[path] || routes["/404"];
  try {
    // Cargar HTML
    const response = await fetch(view);
    if (!response.ok) throw new Error(`Error al cargar la vista: ${view}`);
    const viewContent = await response.text();
    app.innerHTML = viewContent;

    // Cargar CSS de la vista
    const cssId = "dynamic-css";
    let oldCss = document.getElementById(cssId);
    if (oldCss) oldCss.remove(); // eliminar CSS anterior

    const cssLink = document.createElement("link");
    cssLink.id = cssId;
    cssLink.rel = "stylesheet";

    // Determinar archivo CSS según la ruta
    let cssFileName = path === "/" ? "landing" : path.replace("/", "");
    cssLink.href = `/css/${cssFileName}.css`; // landing.css, login.css, register.css, etc.
    document.head.appendChild(cssLink);

    // Cargar controlador si existe
    if (controllers[path]) {
      const module = await import(controllers[path]);
      if (module?.init) module.init();
    }

  } catch (error) {
    console.error(error);
    app.innerHTML = `<h1>Error inesperado al cargar la vista.</h1>`;
  }
}

// Chequea acceso según rol
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

// Navegación principal (async)
export async function navigation(path) {
  const user = await getUserLogged();
  const accessRoute = checkAccess(path, user);
  if (!accessRoute) return;

  if (location.pathname !== accessRoute) {
    history.pushState(null, null, accessRoute);
  }
  await loadView(accessRoute);
}

// Back/forward del navegador
window.addEventListener("popstate", () => {
  loadView(location.pathname);
});

// Links con data-link
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

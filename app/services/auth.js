// src/services/auth.js
import { apiRequest } from "../api/request.js";

// OJO: tus endpoints SIN slash inicial si apiUrl ya termina en "/"
const ENDPOINTS = {
  register: "register", // POST { username, email, pass, code_name }
  login: "login", // POST { email, pass }
  me: "profile", // GET
  logout: "logout", // POST
};

/**
 * Registro con cookie de sesión
 * payload: { username, email, pass, code_name? }
 * En tu caso code_name = "CLIENTE_03"
 */
export function register({ username, email, pass, code_name = "CLIENTE_03" }) {
  return apiRequest("POST", ENDPOINTS.register, {
    username,
    email,
    pass,
    code_name,
  });
}

/**
 * Login (el backend debe setear cookie HttpOnly)
 * payload: { email, pass }
 */
export function login({ email, pass }) {
  return apiRequest("POST", ENDPOINTS.login, { email, pass });
}

/** Usuario autenticado según cookie */
export async function getUserLogged() {
  try {
    return await apiRequest("GET", ENDPOINTS.me, null);
  } catch (e) {
    if (e.status === 401 || e.status === 403) return null;
    throw e;
  }
}

/** Cerrar sesión (invalidar cookie) */
export function logout() {
  return apiRequest("POST", ENDPOINTS.logout, {});
}

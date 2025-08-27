// src/services/auth.js
import { apiRequest } from './apiRequest.js';

// Ajusta estos endpoints a los de tu backend (sin slash inicial si apiUrl ya lo tiene)
const ENDPOINTS = {
  register: '/register', // p.ej. POST -> { username, email, pass, code_name }
  login:    '/login',    // p.ej. POST -> { email, pass }
  me:       '/profile',       // p.ej. GET
  logout:   '/logout',   // p.ej. POST
};

/**
 * Registro con cookie de sesión
 * payload: { username, email, pass, code_name: "CLIENTE_03" }
 */
export function register({ username, email, pass, code_name = 'CLIENTE_03' }) {
  return apiRequest('POST', ENDPOINTS.register, { username, email, pass, code_name });
}

/**
 * Login (el backend debe setear cookie HttpOnly)
 * payload: { email, pass }
 */
export function login({ email, pass }) {
  return apiRequest('POST', ENDPOINTS.login, { email, pass });
}

/** Usuario autenticado según cookie */
export async function getUserLogged() {
  try {
    return await apiRequest('GET', ENDPOINTS.me, null);
  } catch (e) {
    if (e.status === 401 || e.status === 403) return null;
    throw e;
  }
}

/** Cerrar sesión (invalidar cookie) */
export function logout() {
  return apiRequest('POST', ENDPOINTS.logout, {});
}

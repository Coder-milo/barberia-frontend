// app/services/auth.js
import { request } from "./request.js";

const ENDPOINTS = {
  register: "/register",
  login: "/login",
  me: "/profile",
  logout: "/logout",
};

export function register({ username, email, pass, code_name = 'CLIENT_03' }) {
  return request(ENDPOINTS.register, "POST", { username, email, password: pass, code_name });
}

export function login({ email, pass }) {
  return request(ENDPOINTS.login, "POST", { email, password: pass });
}

export async function getUserLogged() {
  try {
    const res = await request(ENDPOINTS.me, "GET");
    return res?.user || null;
  } catch (e) {
    return null; // si no hay sesión, retorna null
  }
}

export function logout() {
  return request(ENDPOINTS.logout, "POST", {});
}

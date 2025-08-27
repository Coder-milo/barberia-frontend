// src/services/apiRequest.js
// instalar: npm install sweetalert2
import Swal from "sweetalert2";

const apiUrl = "http://localhost:3000/"; // OJO: termina en '/'

/**
 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} method
 * @param {string} endpoint  // Ej: 'auth/login' (sin slash inicial)
 * @param {object|null} body
 * @param {object} extraOpts // opcional: { headers?:{}, credentials?:'include'|'same-origin'|'omit' }
 */
export async function apiRequest(
  method,
  endpoint = "",
  body = null,
  extraOpts = {}
) {
  try {
    const options = {
      method,
      credentials: extraOpts.credentials ?? "include",
      headers: {
        "Content-Type": "application/json",
        ...(extraOpts.headers || {}),
      },
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${apiUrl}${endpoint}`, options);

    if (!response.ok) {
      let errPayload = null;
      try {
        errPayload = await response.json();
      } catch {}
      throw {
        status: response.status,
        statusText:
          errPayload?.message || errPayload?.error || response.statusText,
        payload: errPayload,
      };
    }

    // parsea json si hay
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await response.json();
    return await response.text();
  } catch (error) {
    const message = error.statusText || "Ha ocurrido un error";
    Swal.fire({
      icon: "error",
      title: `Error ${error.status || ""}`,
      text: message,
    });
    throw error;
  }
}

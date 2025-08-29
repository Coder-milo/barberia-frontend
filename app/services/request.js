// app/services/request.js
const API_URL = "http://localhost:3000";

export async function request(endpoint, method = "GET", data = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include", // enviar cookies JWT
    };

    if (data) options.body = JSON.stringify(data);

    const res = await fetch(`${API_URL}${endpoint}`, options);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const error = new Error(errData.error || "Error en la petición");
      error.status = res.status;
      throw error;
    }

    return await res.json();
  } catch (err) {
    console.error("Error en request:", err);
    throw err;
  }
}

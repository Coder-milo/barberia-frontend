
//validación + toggle password + POST a API

import {
  isEmail,
  isValidName,
  isValidPassword,
  doPasswordsMatch,
  acceptedTerms,
} from "./services/validators.js";

const API_BASE = "/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirm: document.getElementById("confirm"),
    terms: document.getElementById("terms"),
  };

  const setError = (input, msg) => {
    const small = input.closest(".field")?.querySelector(".error");
    if (small) small.textContent = msg || "";
    input.classList.toggle("has-error", !!msg);
  };

  const clearErrors = () => {
    document.querySelectorAll(".error").forEach((s) => (s.textContent = ""));
    document.querySelectorAll(".has-error").forEach((el) =>
      el.classList.remove("has-error")
    );
  };

  const toggleButtons = document.querySelectorAll(".toggle-pass");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector("i");
      if (!input) return;

      input.type = input.type === "password" ? "text" : "password";
      icon?.classList.toggle("fa-eye");
      icon?.classList.toggle("fa-eye-slash");
    });
  });

  async function postJSON(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.msg) ||
        "Error en la solicitud";
      throw new Error(message);
    }
    return data;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    let ok = true;

    if (!isValidName(fields.name.value)) {
      setError(fields.name, "Ingresa tu nombre.");
      ok = false;
    }

    if (!isEmail(fields.email.value)) {
      setError(fields.email, "Ingresa un correo válido.");
      ok = false;
    }

    if (!isValidPassword(fields.password.value)) {
      setError(fields.password, "Mínimo 6 caracteres.");
      ok = false;
    }

    if (!doPasswordsMatch(fields.password.value, fields.confirm.value)) {
      setError(fields.confirm, "Las contraseñas no coinciden.");
      ok = false;
    }

    if (!acceptedTerms(fields.terms.checked)) {
      const termsErr = document.getElementById("termsError");
      if (termsErr) termsErr.textContent = "Debes aceptar los términos.";
      ok = false;
    }

    if (!ok) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const prevText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Creando cuenta...";

    try {
      const payload = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        password: fields.password.value,
      };

      const data = await postJSON(`${API_BASE}/auth/register`, payload);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      window.location.href = "login.html";
    } catch (err) {
      setError(fields.email, err.message || "No se pudo crear la cuenta.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = prevText;
    }
  });
});

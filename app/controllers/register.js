// app/controllers/register.js
import { navigation } from "../router.js";
import { apiRequest } from "../api/request.js";
import { isEmail, isValidName, isValidPassword, acceptedTerms } from "../services/validations.js";


export function init() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const terms = document.getElementById("terms");
  const termsError = document.getElementById("termsError");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    // Limpiar errores previos
    if (termsError) termsError.textContent = "";
    const errors = [];

    // Validaciones
    if (!isValidName(name.value)) errors.push("Please enter a valid name.");
    if (!isEmail(email.value)) errors.push("Please enter a valid email.");
    if (!isValidPassword(password.value)) errors.push("Password must be at least 6 characters.");
    if (!acceptedTerms(terms.checked)) errors.push("You must accept the terms.");

    // Mostrar errores si existen
    if (errors.length > 0) {
      if (termsError) termsError.innerHTML = errors.join("<br>");
      return;
    }

    // Enviar POST a /register usando apiRequest
    try {
      const data = await apiRequest('POST', 'register', {
        username: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        password: password.value,
        code_name : "CLIENT_03"
      }, true); // true si quieres enviar cookies

      alert("Account created! You can now sign in.", "success");
      navigation("/login"); // SPA navigation

    } catch (err) {
      console.error(err);
      alert("Failed to create account.", "error");
    }
  });
}

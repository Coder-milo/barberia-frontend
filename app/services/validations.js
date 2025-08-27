    // validators.js
    // Funciones reutilizables de validación

    export const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(String(value).trim());
    };

    export const isValidName = (name) => {
    return typeof name === "string" && name.trim().length > 0;
    };

    export const isValidPassword = (password) => {
    return typeof password === "string" && password.length >= 6;
    };

    export const doPasswordsMatch = (pass1, pass2) => {
    return pass1 === pass2;
    };

    export const acceptedTerms = (termsChecked) => {
    return termsChecked === true;
    };

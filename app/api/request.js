
const apiUrl = 'http://localhost:3000/';

/**
 * General-purpose API request function
 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} method 
 * @param {string} endpoint 
 * @param {Object|null} body 
 * @param {boolean} includeCookies - si true, envía cookies (credentials: 'include')
 * @returns {Promise<Object>} JSON response
 */
export async function apiRequest(method, endpoint = '', body = null, includeCookies = false) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      // Solo incluimos cookies si includeCookies es true
      credentials: includeCookies ? 'include' : 'same-origin'
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${apiUrl}${endpoint}`, options);

    if (!response.ok) throw {
      status: response.status,
      statusText: response.statusText
    };

    const json = await response.json();
    return json;

  } catch (error) {
    const message = error.statusText || "An error has occurred";
    console.log(`Error ${error.status || ''}: ${message}`, 'error');
    throw error;
  }
}

import { getUserLogged } from './services/storage';

// Mapeo de rutas a vistas HTML
const routes = {
    '/'             : '/app/views/home.html',
    '/login'        : '/app/views/login.html',
    '/register'     : '/app/views/register.html',
    '/dashboard'    : '/app/views/index.html',
    '/barbero'      : '/app/views/barbero.html',   // Ruta para barbero
    '/cliente'      : '/app/views/cliente.html',   // Ruta para cliente
    '/404'          : '/app/views/404.html',
};

// Mapeo de rutas a controladores JS
const controllers = {
    '/login'        : './controllers/login.js',
    '/register'     : './controllers/register.js',
    '/dashboard'    : './controllers/index.js',
    '/barbero'      : './controllers/barbero.js',
    '/cliente'      : './controllers/cliente.js',
    '/404'          : './controllers/404.js',
};

// Reglas de acceso según rol
const guards = {
    '/login'        : (user) => !user,  // Solo no autenticados pueden ir a login
    '/dashboard'    : (user) => user?.rol === 'administrador',
    '/barbero'      : (user) => user?.rol === 'barbero',
    '/cliente'      : (user) => user?.rol === 'cliente',
};

const app = document.getElementById('app');

export async function loadView(path) {
    const view = routes[path] || routes['/404'];
    try {
        const response = await fetch(view);
        const viewContent = await response.text();
        app.innerHTML = viewContent;

        if (controllers[path]) {
            const module = await import(controllers[path]);
            if (module.init) {
                module.init();
            }
        }
    } catch (error) {
        console.log(error);
        app.innerHTML = `<h1>Error inesperado al cargar la vista.</h1>`;
    }
}

function checkAcces(path, user) {
    const guard = guards[path];

    if (guard && !guard(user)) {
        if (path === '/login' && user) {
            // Redirigir a la página del rol correspondiente si ya está logueado
            switch(user.rol) {
                case 'administrador':
                    return '/dashboard';
                case 'barbero':
                    return '/barbero';
                case 'cliente':
                    return '/cliente';
                default:
                    return '/404';
            }
        }
        // Si no está autorizado
        return user ? '/404' : '/login';
    }

    return path;
}

export function navegation(path) {
    const user = getUserLogged();
    const accessRoute = checkAcces(path, user);

    if (!accessRoute) return;
    history.pushState(null, null, accessRoute);
    loadView(accessRoute);
}

window.addEventListener('popstate', () => {
    navegation(location.pathname);
});

export function navegationTag() {
    document.addEventListener('click', (event) => {
        const elemento = event.target.closest('[data-link]');
        if (!elemento) return;

        event.preventDefault();

        const path = elemento.getAttribute('href') || elemento.getAttribute('data-link');
        if (path) {
            navegation(path);
        }
    });
}

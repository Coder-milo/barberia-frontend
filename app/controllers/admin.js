import { db, uid } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
  // USERS
  const formUsuario = document.getElementById('formUsuario');
  const listaUsuarios = document.getElementById('listaUsuarios');

  // SERVICES
  const formServicio = document.getElementById('formServicio');
  const listaServicios = document.getElementById('listaServicios');

  // APPOINTMENTS
  const listaCitas = document.getElementById('listaCitas');

  function renderUsuarios(){
    if (!listaUsuarios) return;
    listaUsuarios.innerHTML = '';
    db.getBarbers().forEach(u => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${u.name}</strong> <small>@${u.username}</small> <button data-id="${u.id}" class="danger">Delete</button>`;
      listaUsuarios.appendChild(li);
    });
    listaUsuarios.querySelectorAll('button.danger').forEach(btn => {
      btn.addEventListener('click', () => {
        db.deleteBarber(btn.dataset.id);
        renderUsuarios();
      });
    });
  }

  function renderServicios(){
    if (!listaServicios) return;
    listaServicios.innerHTML = '';
    db.getServices().forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${s.name}</strong> — $${s.price} · ${s.duration} ${s.promo ? ` · <em>${s.promo}</em>`:''} <button data-id="${s.id}" class="danger">Delete</button>`;
      listaServicios.appendChild(li);
    });
    listaServicios.querySelectorAll('button.danger').forEach(btn => {
      btn.addEventListener('click', () => {
        db.deleteService(btn.dataset.id);
        renderServicios();
      });
    });
  }

  function renderCitas(){
    if (!listaCitas) return;
    listaCitas.innerHTML = '';
    db.getAppointments().forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.date} ${c.time} — ${c.service} with ${c.barberName} (${c.clientEmail})`;
      listaCitas.appendChild(li);
    });
  }

  if (formUsuario) {
    formUsuario.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombreUsuario').value.trim();
      const user = document.getElementById('userUsuario').value.trim();
      const pass = document.getElementById('passUsuario').value.trim();
      if (!nombre || !user || !pass) return alert('Complete the user form.');
      db.saveBarber({ id: uid('b_'), name: nombre, username: user });
      formUsuario.reset();
      renderUsuarios();
    });
  }

  if (formServicio) {
    formServicio.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombreServicio').value.trim();
      const precio = parseFloat(document.getElementById('precioServicio').value);
      const dur = document.getElementById('duracionServicio').value.trim();
      const promo = document.getElementById('promoServicio').value.trim();
      if (!nombre || isNaN(precio) || !dur) return alert('Complete the service form.');
      db.saveService({ id: uid('s_'), name: nombre, price: precio, duration: dur, promo });
      formServicio.reset();
      renderServicios();
    });
  }

  renderUsuarios();
  renderServicios();
  renderCitas();
});
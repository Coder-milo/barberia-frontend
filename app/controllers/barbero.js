import { db } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const citasUl = document.getElementById('citasPendientes');
  const clientesUl = document.getElementById('clientes');
  const horarioDiv = document.getElementById('horario');
  if (!citasUl || !clientesUl) return;

  // Assume 'john' logged in barber for demo; real app should use session
  const session = JSON.parse(sessionStorage.getItem('bbx_session')||'{}');
  const barberName = session.user || 'John Perez';
  const barber = db.getBarbers().find(b => b.name === barberName) || db.getBarbers()[0];

  function render() {
    const citas = db.getAppointments().filter(c => c.barberId === barber.id);
    citasUl.innerHTML = '';
    const seenClients = new Set();
    clientesUl.innerHTML = '';

    citas.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.date} ${c.time} — ${c.service} (${c.clientEmail})`;
      citasUl.appendChild(li);
      seenClients.add(c.clientEmail);
    });

    [...seenClients].forEach(email => {
      const li = document.createElement('li');
      li.textContent = email;
      clientesUl.appendChild(li);
    });

    if (horarioDiv) {
      horarioDiv.textContent = 'Availability: Mon–Sat 9:00–18:00 (editable in future)';
    }
  }

  render();
});
import { db, uid } from '../services/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCita');
  const lista = document.getElementById('listaCitas');

  if (!form || !lista) return;

  const barberSelect = document.getElementById('barbero');
  const cutSelect = document.getElementById('tipoCorte');
  const dateInput = document.getElementById('fecha');
  const timeInput = document.getElementById('hora');

  // Populate barbers from db
  const barbers = db.getBarbers();
  if (barberSelect && barberSelect.options.length <= 1) {
    barbers.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = b.name;
      barberSelect.appendChild(opt);
    });
  }

  function render() {
    lista.innerHTML = '';
    db.getAppointments().forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${c.service}</strong> with <em>${c.barberName}</em> — ${c.date} ${c.time}`;
      lista.appendChild(li);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const barberId = barberSelect.value;
    const barber = barbers.find(b => b.id === barberId);
    if (!barber) { alert('Please select a barber.'); return; }

    const appointment = {
      id: uid('c_'),
      barberId,
      barberName: barber.name,
      service: cutSelect.value,
      date: dateInput.value,
      time: timeInput.value,
      clientEmail: (JSON.parse(sessionStorage.getItem('bbx_session')||'{}').user)||'guest'
    };
    db.saveAppointment(appointment);
    form.reset();
    render();
  });

  render();
});
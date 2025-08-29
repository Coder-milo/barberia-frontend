

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for nav links
  document.querySelectorAll('#mainNav a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Render services on landing, if a services section exists
  
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    const ul = document.createElement('ul');
    ul.className = 'list';
    services.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${s.name}</strong> — $${s.price} · ${s.duration} ${s.promo ? ` · <em>${s.promo}</em>` : ''}`;
      ul.appendChild(li);
    });
    servicesSection.appendChild(ul);
  }

  // "Login with Google" placeholder -> navigate to login
  const g = document.getElementById('loginGoogle');
  if (g) {
    g.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
});
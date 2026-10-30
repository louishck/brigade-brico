document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

   // Formulaire de contact -> envoi via Formspree sans quitter la page
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const bouton = form.querySelector('button[type="submit"]');
      const texteInitial = bouton.textContent;
      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours...';

      try {
        const reponse = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (reponse.ok) {
          form.reset();
          status.textContent = 'Merci, votre demande a bien ete envoyee. Nous vous repondons sous 24h.';
          status.style.display = 'block';
          form.style.display = 'none';
        } else {
          throw new Error('Erreur envoi');
        }
      } catch (err) {
        status.textContent = 'Une erreur est survenue. Ecrivez-nous sur WhatsApp au 06 59 98 39 78.';
        status.style.display = 'block';
        bouton.disabled = false;
        bouton.textContent = texteInitial;
      }
    });
  }

  // Widget d'avis Google : le script Elfsight (lourd) n'est telecharge
  // que lorsque la section approche de l'ecran.
  const zoneAvis = document.querySelector('[data-elfsight-app-lazy]');

  if (zoneAvis) {
    const chargerElfsight = () => {
      if (document.getElementById('elfsight-platform')) return;
      const s = document.createElement('script');
      s.id = 'elfsight-platform';
      s.src = 'https://elfsightcdn.com/platform.js';
      s.async = true;
      document.body.appendChild(s);
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          chargerElfsight();
          obs.disconnect();
        }
      }, { rootMargin: '600px' });
      obs.observe(zoneAvis);
    } else {
      chargerElfsight();
    }
  }
});

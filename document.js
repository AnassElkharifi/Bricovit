    /* ── HEADER SCROLL EFFECT ── */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ── HAMBURGER / MOBILE NAV ── */
    const hamburger  = document.getElementById('hamburger');
    const mobileNav  = document.getElementById('mobileNav');

    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    /* ── SCROLL REVEAL ── */
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* Immediate hero reveal on load */
    document.querySelectorAll('#hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 150 + i * 130);
    });

    /* ── ACTIVE NAV LINK ── */
    const navLinks = document.querySelectorAll('.nav a');
    const secObs   = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));

    /* ── SMOOTH SCROLL ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });

    /* ── FORM VALIDATION ── */
    const form        = document.getElementById('quoteForm');
    const formSuccess = document.getElementById('formSuccess');

    function validate(id, errId, condition) {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      const ok  = condition(el.value.trim());
      el.classList.toggle('error', !ok);
      err.classList.toggle('show',  !ok);
      return ok;
    }

    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const isPhone = v => /^[\d\s\+\-\.]{8,15}$/.test(v);


    // Code de Carossel
    (function () {
      /* Racine unique du composant */
      const root    = document.querySelector('.spx-carousel');
      const track   = root.querySelector('#spxTrack');
      const btnPrev = root.querySelector('#spxBtnPrev');
      const btnNext = root.querySelector('#spxBtnNext');
      const dotsNav = root.querySelector('#spxDots');
      const cards   = Array.from(track.querySelectorAll('.spx-card'));

      let currentIndex = 0;
      let cardsPerView = 3;

      /* Nombre de cartes visibles selon la largeur */
      function getCardsPerView() {
        const w = window.innerWidth;
        if (w <= 580) return 1;
        if (w <= 900) return 2;
        return 3;
      }

      /* Nombre max de pas de défilement */
      function totalSteps() {
        return Math.max(0, cards.length - cardsPerView);
      }

      /* Déplacer la piste */
      function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, totalSteps()));

        const gap    = 24; /* correspond au gap CSS */
        const offset = currentIndex * (cards[0].offsetWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex >= totalSteps();
        updateDots();
      }

      /* Créer les indicateurs */
      function buildDots() {
        dotsNav.innerHTML = '';
        for (let i = 0; i <= totalSteps(); i++) {
          const btn = document.createElement('button');
          btn.className = 'spx-dot' + (i === 0 ? ' is-active' : '');
          btn.setAttribute('aria-label', `Position ${i + 1}`);
          btn.addEventListener('click', () => goTo(i));
          dotsNav.appendChild(btn);
        }
      }

      /* Synchroniser les indicateurs */
      function updateDots() {
        dotsNav.querySelectorAll('.spx-dot')
          .forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
      }

      /* Boutons flèches */
      btnPrev.addEventListener('click', () => goTo(currentIndex - 1));
      btnNext.addEventListener('click', () => goTo(currentIndex + 1));

      /* Swipe tactile */
      let touchStartX = 0;
      track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40)
          diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
      }, { passive: true });

      /* Recalcul au resize */
      window.addEventListener('resize', () => {
        const newCPV = getCardsPerView();
        if (newCPV !== cardsPerView) {
          cardsPerView = newCPV;
          currentIndex = 0;
          buildDots();
        }
        goTo(currentIndex);
      });

      /* Initialisation */
      cardsPerView = getCardsPerView();
      buildDots();
      goTo(0);

    })();

    // Live feedback on blur
    document.getElementById('fname').addEventListener('blur',    () => validate('fname',   'err-fname',   v => v.length >= 2));
    document.getElementById('lname').addEventListener('blur',    () => validate('lname',   'err-lname',   v => v.length >= 2));
    document.getElementById('email').addEventListener('blur',    () => validate('email',   'err-email',   isEmail));
    document.getElementById('phone').addEventListener('blur',    () => validate('phone',   'err-phone',   isPhone));
    document.getElementById('service').addEventListener('change',() => validate('service', 'err-service', v => v !== ''));

    // Clear error on input
    ['fname','lname','email','phone','service'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        document.getElementById(id).classList.remove('error');
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = [
        validate('fname',   'err-fname',   v => v.length >= 2),
        validate('lname',   'err-lname',   v => v.length >= 2),
        validate('email',   'err-email',   isEmail),
        validate('phone',   'err-phone',   isPhone),
        validate('service', 'err-service', v => v !== ''),
      ].every(Boolean);

      if (ok) {
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';
        btn.disabled = true;
        setTimeout(() => {
          form.style.display    = 'none';
          formSuccess.classList.add('show');
        }, 1500);
      }
    });
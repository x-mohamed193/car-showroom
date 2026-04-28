// ========================================
// معرض الشافعي للسيارات - Main JavaScript
// ========================================

// ---- Navbar Scroll Effect ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ---- Mobile Menu ----
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ---- Active Nav Link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  if (!el.dataset.delay) {
    el.dataset.delay = (i % 4) * 80;
  }
  revealObserver.observe(el);
});

// ---- Countdown Timer ----
function updateCountdown() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);
  endDate.setHours(23, 59, 59);

  function tick() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');

    const els = {
      days: document.getElementById('cnt-days'),
      hours: document.getElementById('cnt-hours'),
      mins: document.getElementById('cnt-mins'),
      secs: document.getElementById('cnt-secs'),
    };

    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.mins) els.mins.textContent = pad(mins);
    if (els.secs) els.secs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

updateCountdown();

// ---- Car Gallery (details page) ----
const thumbs = document.querySelectorAll('.thumb');
const mainImg = document.querySelector('.main-image img');

if (thumbs.length && mainImg) {
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.querySelector('img').src;
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
      }, 200);
    });
  });
}

// ---- Contact Form ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-primary');
    const success = document.getElementById('formSuccess');

    btn.textContent = 'جاري الإرسال...';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'إرسال الرسالة';
      btn.disabled = false;
      if (success) {
        success.style.display = 'block';
        setTimeout(() => success.style.display = 'none', 5000);
      }
    }, 1500);
  });
}

// ---- Cars Filter (cars.html) ----
const filterBrand = document.getElementById('filterBrand');
const filterType = document.getElementById('filterType');
const filterPrice = document.getElementById('filterPrice');
const searchInput = document.getElementById('carSearch');
const carsGrid = document.getElementById('carsGrid');
const carsCountEl = document.getElementById('carsCount');

function filterCars() {
  if (!carsGrid) return;
  const cards = carsGrid.querySelectorAll('.car-card');
  let visible = 0;

  cards.forEach(card => {
    const brand = (card.dataset.brand || '').toLowerCase();
    const type = (card.dataset.type || '').toLowerCase();
    const price = parseInt(card.dataset.price || '0');
    const name = (card.dataset.name || '').toLowerCase();

    const bMatch = !filterBrand || filterBrand.value === '' || brand === filterBrand.value;
    const tMatch = !filterType || filterType.value === '' || type === filterType.value;
    const sMatch = !searchInput || searchInput.value === '' || name.includes(searchInput.value.toLowerCase());

    let pMatch = true;
    if (filterPrice && filterPrice.value) {
      const [min, max] = filterPrice.value.split('-').map(Number);
      if (max) pMatch = price >= min && price <= max;
      else pMatch = price >= min;
    }

    if (bMatch && tMatch && sMatch && pMatch) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  if (carsCountEl) {
    carsCountEl.querySelector('span').textContent = visible;
  }
}

[filterBrand, filterType, filterPrice, searchInput].forEach(el => {
  if (el) el.addEventListener('change', filterCars);
});

if (searchInput) {
  searchInput.addEventListener('input', filterCars);
}

// ---- Smooth transitions for images ----
document.querySelectorAll('img').forEach(img => {
  img.style.transition = 'opacity 0.3s ease';
  img.addEventListener('error', function() {
    this.style.display = 'none';
    const placeholder = this.closest('.car-card-image, .main-image, .about-image, .team-avatar');
    if (placeholder) {
      placeholder.style.background = 'linear-gradient(135deg, #12121f, #1a1f3a)';
    }
  });
});

console.log('🚗 معرض الشافعي للسيارات - Loaded');

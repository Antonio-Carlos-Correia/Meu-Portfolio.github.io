'use strict';

/* =====================================================
   SELEÇÃO SEGURA DE ELEMENTOS
===================================================== */
const sections = document.querySelectorAll('.section');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navOverlay = document.getElementById('nav-overlay');
const navLinks = document.querySelectorAll('[data-nav]');
const topBtn = document.getElementById('top-btn');

/* =====================================================
   FUNÇÃO: MOSTRAR SEÇÃO (SPA)
===================================================== */
function showSection(hash) {
  if (!hash) return;

  const targetSection = document.querySelector(hash);
  if (!targetSection) return;

  // Remove active de todas
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Ativa a seção correta
  targetSection.classList.add('active');

  // Atualiza menu ativo
  navLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');

    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =====================================================
   NAVEGAÇÃO POR CLIQUE (SPA)
===================================================== */
navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const hash = link.getAttribute('href');

    // Só intercepta links internos
    if (!hash || !hash.startsWith('#')) return;

    event.preventDefault();
    showSection(hash);
    closeMenu();
  });
});

/* =====================================================
   MENU MOBILE
===================================================== */
function openMenu() {
  if (!navMenu) return;

  navMenu.classList.add('is-open');
  if (navOverlay) navOverlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!navMenu) return;

  navMenu.classList.remove('is-open');
  if (navOverlay) navOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

if (navOverlay) {
  navOverlay.addEventListener('click', closeMenu);
}

// Fecha menu com ESC
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

/* =====================================================
   BOTÃO VOLTAR AO TOPO
===================================================== */
if (topBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================================================
   SUPORTE A HASH DIRETO NA URL
===================================================== */
window.addEventListener('load', () => {
  const initialHash = window.location.hash;

  if (initialHash && document.querySelector(initialHash)) {
    showSection(initialHash);
  } else {
    showSection('#home');
  }
});

/* =====================================================
   ACESSIBILIDADE EXTRA
===================================================== */

// Permite navegar pelo menu com Enter
navLinks.forEach(link => {
  link.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const hash = link.getAttribute("href");
      if (hash && hash.startsWith("#")) {
        showSection(hash);
      }
    }
  });
});

// Foco automático no conteúdo ao trocar seção
function focusSection(hash) {
  const section = document.querySelector(hash);
  if (!section) return;

  section.setAttribute("tabindex", "-1");
  section.focus();
}

// Ajuste na função showSection
const originalShowSection = showSection;
showSection = function(hash) {
  originalShowSection(hash);
  focusSection(hash);
};


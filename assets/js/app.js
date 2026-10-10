'use strict';

// Personaliza aquí los nombres de las fotos si deseas cambiarlos.
const photos = [
  { src: 'assets/img/portada.webp', title: 'Juntos en Navidad', alt: 'Cuatro personas posando frente a árboles navideños' },
  { src: 'assets/img/sonrisas.webp', title: 'Sonrisas que iluminan', alt: 'Retrato familiar de cinco personas en una decoración navideña' },
  { src: 'assets/img/dulces.webp', title: 'Navidad entre risas', alt: 'Dos personas divirtiéndose en una cocina navideña' },
  { src: 'assets/img/abrazos.webp', title: 'Lo que nos une', alt: 'Tres personas abrazadas en una sesión fotográfica navideña' },
  { src: 'assets/img/juntos.webp', title: 'Siempre cerca', alt: 'Tres hombres posando juntos entre árboles de Navidad' },
];

const dialog = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCount = document.getElementById('lightbox-count');
const closeButton = document.getElementById('lightbox-close');
const prevButton = document.getElementById('lightbox-prev');
const nextButton = document.getElementById('lightbox-next');
const toast = document.getElementById('toast');
let activeIndex = 0;
let previousFocus = null;
let toastTimer;

function showPhoto(index) {
  activeIndex = (index + photos.length) % photos.length;
  const photo = photos[activeIndex];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.title;
  lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  const next = new Image();
  next.src = photos[(activeIndex + 1) % photos.length].src;
}
function openLightbox(index) {
  previousFocus = document.activeElement;
  showPhoto(index);
  dialog.hidden = false;
  document.body.classList.add('modal-open');
  closeButton.focus();
}
function closeLightbox() {
  dialog.hidden = true;
  document.body.classList.remove('modal-open');
  lightboxImage.removeAttribute('src');
  if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
}
document.querySelectorAll('[data-photo]').forEach((button) => {
  button.addEventListener('click', () => openLightbox(Number(button.dataset.photo)));
});
closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => showPhoto(activeIndex - 1));
nextButton.addEventListener('click', () => showPhoto(activeIndex + 1));
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (dialog.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') showPhoto(activeIndex + 1);
  if (event.key === 'ArrowLeft') showPhoto(activeIndex - 1);
  if (event.key === 'Tab') {
    const controls = [closeButton, prevButton, nextButton];
    const index = controls.indexOf(document.activeElement);
    if (event.shiftKey && index === 0) { event.preventDefault(); nextButton.focus(); }
    if (!event.shiftKey && index === controls.length - 1) { event.preventDefault(); closeButton.focus(); }
  }
});
let touchStartX = 0;
lightboxImage.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightboxImage.addEventListener('touchend', (event) => {
  const diff = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 40) showPhoto(activeIndex + (diff < 0 ? 1 : -1));
}, { passive: true });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3700);
}
document.getElementById('share-button').addEventListener('click', async () => {
  if (location.protocol === 'file:') {
    showToast('Publica el álbum en GitHub Pages para obtener un enlace compartible.');
    return;
  }
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, text: 'Te comparto un recuerdo especial ✨', url: location.href.split('#')[0] });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(location.href.split('#')[0]);
      showToast('¡Enlace copiado! Ya puedes compartirlo.');
    } else {
      showToast('Copia el enlace de la barra de direcciones para compartirlo.');
    }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('No fue posible compartir automáticamente. Copia el enlace del navegador.');
  }
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.add('is-visible'); observer.unobserve(target); }
    });
  }, { threshold: .06, rootMargin: '0px 0px 30px 0px' });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}
const progress = document.getElementById('scroll-progress');
let ticking = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
updateProgress();
document.getElementById('current-year').textContent = new Date().getFullYear();

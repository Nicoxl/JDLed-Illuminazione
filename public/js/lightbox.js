/*Script funzionamento lightbox galleria*/
document.addEventListener('DOMContentLoaded', function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  let currentIndex = 0;
  const imageSources = Array.from(triggers).map(img => img.dataset.full);
  
  // Variabile per salvare dove si trovava l'utente
  let scrollPosition = 0;

  function openLightbox(index) {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    currentIndex = index;
    lightboxImg.src = imageSources[currentIndex];
    lightbox.classList.add('active');
    
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${scrollPosition}px`;
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageSources.length;
    lightboxImg.src = imageSources[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    lightboxImg.src = imageSources[currentIndex];
  }

  triggers.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') closeLightbox();
  });
  // BLOCCA ZOOM SU IPHONE (Safari)
  // Impedisce l'evento "gesture" (pinch) dentro la lightbox
  lightbox.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });
  
  lightbox.addEventListener('touchmove', function(e) {
    // Se l'utente usa più di 1 dito (sta provando a zoomare), blocca tutto
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
});
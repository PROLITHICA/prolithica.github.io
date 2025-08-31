(() => {
  const wrap  = document.getElementById('hero-visual');
  if (!wrap) return;
  const card  = wrap.querySelector('.brand-card');
  const rails = wrap.querySelectorAll('.pill-rail .pill');

  let raf = 0;
  function onMove(e){
    const r = wrap.getBoundingClientRect();
    const nx = (e.clientX - r.left)/r.width - .5;
    const ny = (e.clientY - r.top)/r.height - .5;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const px = nx * 10, py = ny * 10; // subtle
      card.style.transform = `translate3d(${px * 0.5}px, ${py * 0.5}px, 0)`;
      rails.forEach((pill,i) => {
        const s = 1 - i*0.08;
        pill.style.transform = `translate3d(${px * s * 0.3}px, ${py * s * 0.3}px, 0)`;
      });
    });
  }
  function reset(){
    card.style.transform = '';
    rails.forEach(p => p.style.transform = '');
  }

  wrap.addEventListener('mousemove', onMove);
  wrap.addEventListener('mouseleave', reset);

  // Accessibility
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches){
    wrap.removeEventListener('mousemove', onMove);
    wrap.removeEventListener('mouseleave', reset);
  }
})();
(function () {
      const orbit = document.getElementById('orbit');
      if (!orbit) return;

      const pills = Array.from(orbit.querySelectorAll('.orbit-pill'));
      const logo  = orbit.querySelector('.logo-card');

      const toRad = (deg) => (deg * Math.PI) / 180;

      function placePills() {
  const o = orbit.getBoundingClientRect();
  const l = logo.getBoundingClientRect();

  const half  = Math.min(o.width, o.height) / 2; // outer ring
  const inner = half * 0.82;
  const outer = half * 1.00;

  const logoR  = Math.max(l.width, l.height) / 2;
  const safety = 18;

  // Read angles & detect issues
  const rawAngles = pills.map(p => Number(p.dataset.angle));
  const invalid   = rawAngles.some(a => !Number.isFinite(a));
  const dupes     = new Set(rawAngles).size !== rawAngles.length;

  // If any angle is bad/duplicate, evenly distribute + set dataset for clarity
  if (invalid || dupes) {
    const step = 360 / pills.length;
    const offset = 10; // small bias so nothing sits exactly on axes
    pills.forEach((p, i) => {
      p.dataset.angle = (offset + i * step).toString();
      // Alternate bands if not provided
      if (!p.dataset.band) p.dataset.band = i % 2 === 0 ? 'outer' : 'inner';
    });
  } else {
    // Also alternate bands if they were omitted
    pills.forEach((p, i) => {
      if (!p.dataset.band) p.dataset.band = i % 2 === 0 ? 'outer' : 'inner';
    });
  }

  // Position pills on the chosen ring, keeping them clear of the logo card
  pills.forEach((pill) => {
    const angle = Number(pill.dataset.angle);
    const band  = (pill.dataset.band || 'outer').toLowerCase();
    const pillR = Math.max(pill.offsetWidth, pill.offsetHeight) / 2;

    const baseR = band === 'inner' ? inner : outer;
    const minR  = logoR + pillR + safety;
    const r     = Math.max(baseR, minR);

    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * r;
    const y = Math.sin(rad) * r;

    pill.style.setProperty('--x', `${x}px`);
    pill.style.setProperty('--y', `${y}px`);
    pill.style.setProperty('--px', `0px`);
    pill.style.setProperty('--py', `0px`);
  });
}


      // cursor parallax (very gentle)
      let raf = null;
      function onMove(e) {
        const rect = orbit.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width  - 0.5;
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;
        const px = nx * 10;
        const py = ny * 10;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          pills.forEach((pill, i) => {
            const s = 1 - i * 0.08; // tiny stagger for organic feel
            pill.style.setProperty('--px', `${px * s}px`);
            pill.style.setProperty('--py', `${py * s}px`);
          });
        });
      }
      function resetParallax() {
        pills.forEach((pill) => {
          pill.style.setProperty('--px', `0px`);
          pill.style.setProperty('--py', `0px`);
        });
      }

      // init & bindings
      placePills();
      window.addEventListener('resize', placePills);
      orbit.addEventListener('mousemove', onMove);
      orbit.addEventListener('mouseleave', resetParallax);

      // respect reduced motion
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) {
        orbit.removeEventListener('mousemove', onMove);
        orbit.removeEventListener('mouseleave', resetParallax);
      }
    })();
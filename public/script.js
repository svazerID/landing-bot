// public/script.js
// Modernized version for Astro SSR migration (Stable Version)
// This file handles client-side animations and interactive widgets.

function init() {
  try {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    initGitHubMatrix();
    initClock();

    setTimeout(() => {
      if (typeof initKineticEngine === 'function') {
        initKineticEngine();
      }
    }, 100);
  } catch (error) {
    console.error("INIT ERROR:", error.stack || error);
  }
}

function initClock() {
  const updateClock = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const timeEl = document.getElementById('geist-time');
    const secEl = document.getElementById('geist-seconds');
    if (timeEl) timeEl.textContent = `${h}:${m}`;
    if (secEl) secEl.textContent = s;
  };
  updateClock();
  setInterval(updateClock, 1000);
}

async function initGitHubMatrix() {
  const githubMatrix = document.querySelector(".github-matrix");
  if (!githubMatrix) return;
  githubMatrix.innerHTML = "";
  try {
    const ghResp = await fetch("https://github-contributions-api.deno.dev/svazerID");
    if (ghResp.ok) {
      const ghData = await ghResp.json();
      const countEl = document.getElementById("gh-total-count");
      if (countEl) {
        let total = 0;
        if (ghData.totalContributions) total = ghData.totalContributions;
        else if (ghData.total) total = Object.values(ghData.total).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
        countEl.textContent = `${total.toLocaleString()} contributions in the last year`;
      }
      const flattened = ghData.contributions.flat().slice(-245);
      flattened.forEach(day => {
        const box = document.createElement("div");
        box.className = "gh-box";
        if (day.intensity > 0) box.classList.add(`lvl-${day.intensity}`);
        githubMatrix.appendChild(box);
      });
    }
  } catch (e) {
    for (let i = 0; i < 245; i++) {
      const box = document.createElement("div");
      box.className = "gh-box";
      githubMatrix.appendChild(box);
    }
  }
}

function initKineticEngine() {
  if (typeof gsap === 'undefined') return;
  
  // Clean up all existing ScrollTriggers to prevent overlaps between pages
  ScrollTrigger.getAll().forEach(t => t.kill());
  
  // Only register once
  if (!gsap.plugins.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }

  const cursor = document.querySelector('.custom-cursor');
  const heroText = document.querySelector('.hero-massive-text');
  
  if (cursor) {
    // Kill previous mousemove to avoid duplicates on transition
    if (window._cursorMove) {
      window.removeEventListener("mousemove", window._cursorMove);
    }

    const xTo = gsap.quickTo(cursor, "left", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "top", { duration: 0.1, ease: "power3" });

    let hasMoved = false;

    window._cursorMove = (e) => {
      if (!hasMoved) {
        gsap.set(cursor, { opacity: 1 });
        hasMoved = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);

      if (heroText) {
        const xNorm = (e.clientX / window.innerWidth) * 2 - 1;
        const yNorm = (e.clientY / window.innerHeight) * 2 - 1;
        gsap.to(heroText, { x: xNorm * 30, y: yNorm * 30, duration: 1, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", window._cursorMove);

    const hoverElements = document.querySelectorAll('[data-hover], a, button');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // Ensure homepage doesn't stay black if we load it directly at a panel
  const projectBg = document.body.getAttribute('data-project-bg');
  if (projectBg) {
    gsap.to('body', { backgroundColor: projectBg, duration: 0.8 });
  }

  const panels = gsap.utils.toArray('.app-panel');
  panels.forEach((panel, i) => {
    const bgColor = panel.getAttribute('data-bg') || '#000000';
    ScrollTrigger.create({
      trigger: panel,
      start: "top center",
      end: "bottom center",
      onEnter: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.8 }),
      onEnterBack: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.8 }),
      onLeave: () => { if (i === panels.length - 1) gsap.to('body', { backgroundColor: '#000000', duration: 0.8 }); },
      onLeaveBack: () => { if (i === 0) gsap.to('body', { backgroundColor: '#000000', duration: 0.8 }); }
    });

    const textEls = panel.querySelectorAll('.app-index, .app-title, .app-desc, .app-meta');
    if (textEls.length > 0) {
      gsap.set(textEls, { opacity: 0, y: 60 });
      ScrollTrigger.create({
        trigger: panel,
        start: "top 75%",
        end: "bottom 25%",
        onEnter: () => gsap.fromTo(textEls, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", overwrite: true }),
        onLeave: () => gsap.to(textEls, { opacity: 0, y: -60, duration: 0.5, stagger: 0.1, ease: "power3.in", overwrite: true }),
        onEnterBack: () => gsap.fromTo(textEls, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.8, stagger: -0.15, ease: "power3.out", overwrite: true }),
        onLeaveBack: () => gsap.to(textEls, { opacity: 0, y: 60, duration: 0.5, stagger: -0.1, ease: "power3.in", overwrite: true })
      });
    }
  });

  const logbookEntries = gsap.utils.toArray('.logbook-entry');
  logbookEntries.forEach(entry => {
    const date = entry.querySelector('.logbook-date');
    const title = entry.querySelector('.logbook-title-parallax');
    if (date && title) {
      gsap.set([date, title], { x: 50, opacity: 0 });
      ScrollTrigger.create({
        trigger: entry,
        start: "top 85%",
        onEnter: () => gsap.fromTo([date, title], { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" }),
        onLeave: () => gsap.to([date, title], { x: -50, opacity: 0, duration: 0.6, stagger: 0.05 }),
        onEnterBack: () => gsap.fromTo([date, title], { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: -0.1, ease: "power4.out" }),
        onLeaveBack: () => gsap.to([date, title], { x: 50, opacity: 0, duration: 0.6, stagger: -0.05 })
      });
    }
  });

  const dots = document.querySelectorAll('.dot-nav .dot');
  dots.forEach(dot => {
    const targetId = dot.getAttribute('data-target');
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      if (targetId) gsap.to(window, { duration: 1, scrollTo: { y: targetId, autoKill: false }, ease: "power3.inOut" });
    });
    if (targetId) {
      ScrollTrigger.create({
        trigger: targetId,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => { if (self.isActive) { dots.forEach(d => d.classList.remove('active')); dot.classList.add('active'); } }
      });
    }
  });

  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  if (hamburgerBtn && mobileMenuOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileMenuOverlay.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    mobileNavLinks.forEach(link => link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }));
  }
}

// Support Astro View Transitions
document.addEventListener('astro:page-load', init);

// Fallback for initial load if transitions aren't enabled yet
if (!window.astroTransitionAttached) {
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
  window.astroTransitionAttached = true;
}
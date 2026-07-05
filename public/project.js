// public/project.js
// Magazine layout scripts (Stable Version)

function initProject() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  if (typeof gsap === 'undefined') return;
  
  // Clean up existing triggers
  ScrollTrigger.getAll().forEach(t => t.kill());
  
  if (!gsap.plugins.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Ensure body background is correct
  const projectBg = document.body.getAttribute('data-project-bg');
  if (projectBg) {
    gsap.to('body', { backgroundColor: projectBg, duration: 0.8, ease: "power2.out" });
  }

  let progressBar = document.querySelector('.reading-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
  }
  
  gsap.set(progressBar, { width: 0, opacity: 1, y: 0 }); // Reset for new page
  
  gsap.to(progressBar, {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3
    }
  });

  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    if (window._cursorMove) {
      window.removeEventListener("mousemove", window._cursorMove);
    }

    const xTo = gsap.quickTo(cursor, "left", {duration: 0.1, ease: "power3"});
    const yTo = gsap.quickTo(cursor, "top", {duration: 0.1, ease: "power3"});

    let hasMoved = false;
    window._cursorMove = (e) => {
      if (!hasMoved) {
        gsap.set(cursor, { opacity: 1 });
        hasMoved = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", window._cursorMove);

    const hoverElements = document.querySelectorAll('[data-hover], a, button');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  const heroImg = document.querySelector('.project-hero-img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".project-hero-wrapper",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
  
  const textEls = document.querySelectorAll('.article-body p, .article-body blockquote, .article-body h2, .article-body h3');
  textEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      gsap.set(el, { opacity: 1, y: 0 });
    } else {
      gsap.fromTo(el, { opacity: 0, y: 40 }, { 
        opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
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

document.addEventListener('astro:page-load', initProject);

if (!window.projectTransitionAttached) {
  if (document.readyState === 'complete') {
    initProject();
  } else {
    window.addEventListener('load', initProject);
  }
  window.projectTransitionAttached = true;
}

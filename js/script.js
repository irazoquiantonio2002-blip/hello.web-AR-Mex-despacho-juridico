(function () {
  const phone = "525544836842";
  document.body.classList.add("loading");

  const loader = document.getElementById("loading-screen");
  let loaderHidden = false;
  const hideLoader = () => {
    if (loaderHidden) return;
    loaderHidden = true;
    loader?.classList.add("is-hidden");
    loader?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("loading");
    window.setTimeout(() => {
      if (loader) loader.style.display = "none";
    }, 850);
  };
  document.addEventListener("DOMContentLoaded", () => window.setTimeout(hideLoader, 1400));
  window.addEventListener("load", () => window.setTimeout(hideLoader, 1000));
  window.setTimeout(hideLoader, 3000);

  const header = document.getElementById("siteHeader");
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    const scrolled = window.scrollY > 24;
    header?.classList.toggle("is-scrolled", scrolled);
    toTop?.classList.toggle("is-visible", window.scrollY > 640);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  navToggle?.addEventListener("click", () => {
    const isOpen = mobileNav?.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      navToggle?.classList.remove("is-active");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const waToggle = document.getElementById("waToggle");
  const waMenu = document.getElementById("waMenu");
  waToggle?.addEventListener("click", () => {
    const isOpen = waMenu?.classList.toggle("is-open");
    waToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  document.addEventListener("click", (event) => {
    if (!waMenu || !waToggle) return;
    if (!event.target.closest(".wa-float")) {
      waMenu.classList.remove("is-open");
      waToggle.setAttribute("aria-expanded", "false");
    }
  });

  const reveals = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px" });
  reveals.forEach((el) => revealObserver.observe(el));

  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => countObserver.observe(el));

  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1300;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const typeTarget = document.getElementById("typeTarget");
  const words = ["México", "Latinoamérica", "Estados Unidos", "Canadá", "Europa"];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let deleting = true;

  function typeLoop() {
    if (!typeTarget) return;
    const word = words[wordIndex];
    typeTarget.textContent = word.slice(0, charIndex);

    if (deleting) {
      charIndex -= 1;
      if (charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    } else {
      charIndex += 1;
      if (charIndex >= words[wordIndex].length) {
        deleting = true;
        window.setTimeout(typeLoop, 1400);
        return;
      }
    }

    window.setTimeout(typeLoop, deleting ? 46 : 78);
  }
  window.setTimeout(typeLoop, 1200);

  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const nombre = String(data.get("nombre") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const pais = String(data.get("pais") || "").trim();
    const area = String(data.get("area") || "").trim();
    const mensaje = String(data.get("mensaje") || "").trim();
    const text = [
      "Hola AR-MEX, quiero solicitar una consulta jurídica confidencial.",
      nombre ? `Nombre: ${nombre}` : "",
      telefono ? `Teléfono: ${telefono}` : "",
      pais ? `País: ${pais}` : "",
      area ? `Área legal: ${area}` : "",
      mensaje ? `Mensaje: ${mensaje}` : ""
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  setupParticles(document.getElementById("heroParticles"), 52, true);
  document.querySelectorAll(".section-particles").forEach((canvas) => setupParticles(canvas, 24, false));

  function setupParticles(canvas, amount, connect) {
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: amount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.8 + .6,
        alpha: Math.random() * .42 + .16
      }));
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${p.alpha})`;
        ctx.fill();

        if (!connect) return;
        for (let j = index + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(201, 162, 39, ${(.16 * (1 - distance / 120)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
  }
})();

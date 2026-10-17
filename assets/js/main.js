// Shared site behavior: header/footer injection, mobile nav, active link, accordions.
(function () {
  async function includePartials() {
    const headerSlot = document.getElementById("site-header");
    const footerSlot = document.getElementById("site-footer");

    if (headerSlot) {
      const res = await fetch("/partials/header.html");
      headerSlot.innerHTML = await res.text();
      setActiveNav();
      wireMobileNav();
      wireHeaderScroll();
    }
    if (footerSlot) {
      const res = await fetch("/partials/footer.html");
      footerSlot.innerHTML = await res.text();
      const yearEl = document.getElementById("year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    }
  }

  function setActiveNav() {
    const current = document.body.getAttribute("data-page");
    if (!current) return;
    document.querySelectorAll("[data-nav]").forEach((el) => {
      if (el.getAttribute("data-nav") === current) {
        el.classList.add("active");
      }
    });
  }

  function wireMobileNav() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => nav.classList.toggle("open"));

    // On mobile, tapping a dropdown parent expands it instead of navigating away.
    nav.querySelectorAll(".has-dropdown > .nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 1240) {
          e.preventDefault();
          link.parentElement.classList.toggle("open");
        }
      });
    });
  }

  // On mobile/tablet the header slides away while scrolling down and comes
  // back as soon as the user scrolls up (or when the menu is open).
  function wireHeaderScroll() {
    const header = document.querySelector(".site-header");
    const nav = document.getElementById("mainNav");
    if (!header) return;
    const mobile = window.matchMedia("(max-width: 1240px)");
    const THRESHOLD = 6;
    let lastY = Math.max(window.scrollY, 0);
    let ticking = false;

    function update() {
      ticking = false;
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;
      const menuOpen = nav && nav.classList.contains("open");

      if (!mobile.matches || menuOpen || y <= header.offsetHeight) {
        header.classList.remove("header-hidden");
        lastY = y;
      } else if (delta > THRESHOLD) {
        header.classList.add("header-hidden");
        lastY = y;
      } else if (delta < -THRESHOLD) {
        header.classList.remove("header-hidden");
        lastY = y;
      }
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
  }

  function wireAccordions() {
    document.querySelectorAll(".accordion-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion-item");
        const panel = item.querySelector(".accordion-panel");
        const isOpen = item.classList.contains("open");

        item.classList.toggle("open", !isOpen);
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
      });
    });

    // Open the accordion item matching the URL hash, if any.
    if (location.hash) {
      const target = document.querySelector(
        `.accordion-item[id="${location.hash.slice(1)}"]`
      );
      if (target) {
        target.classList.add("open");
        const panel = target.querySelector(".accordion-panel");
        if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
        setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    includePartials();
    wireAccordions();
  });
})();

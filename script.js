
/* ==========================================
   KBK HOSPITALITY
   Scroll animations, navigation & gallery
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. FOOTER YEAR */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* 2. STICKY HEADER */

  const header = document.querySelector(".header");

  const updateHeader = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 30);
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* 3. MOBILE NAVIGATION */

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");

      menuToggle.classList.toggle("active", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }


  /* 4. SCROLL-TRIGGERED ANIMATIONS */

  const revealSelectors = [
    ".about-top",
    ".about-grid",
    ".kbk-about-heading",
    ".kbk-about-card",
    ".kbk-about-vision",
    ".kbk-about-closing",
    ".section-heading",
    ".business-card",
    ".apartment-feature-image",
    ".apartment-feature-content",
    ".legacy-year",
    ".legacy-copy",
    ".gallery-heading",
    ".gallery-item",
    ".contact-intro",
    ".contact-panel"
  ];

  const revealElements = [
    ...new Set(
      revealSelectors.flatMap(selector =>
        Array.from(document.querySelectorAll(selector))
      )
    )
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function showAllElements() {
    revealElements.forEach(element => {
      element.classList.add("kbk-reveal", "is-visible");
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAllElements();
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach((element, index) => {
      element.classList.add("kbk-reveal");

      // Cards enter one after another.
      if (
        element.matches(".gallery-item, .business-card, .kbk-about-card")
      ) {
        element.style.setProperty(
          "--reveal-delay",
          `${(index % 4) * 120}ms`
        );
      }

      observer.observe(element);
    });
  }


  /* 5. GALLERY LIGHTBOX */

  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const counter = document.getElementById("galleryCounter");

  const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
  );

  const closeButton = document.querySelector(".gallery-close");
  const previousButton = document.querySelector(".gallery-prev");
  const nextButton = document.querySelector(".gallery-next");

  let currentIndex = 0;
  let previousFocus = null;

  function displayImage(index) {
    if (!galleryItems.length || !lightboxImage) return;

    currentIndex =
      (index + galleryItems.length) % galleryItems.length;

    const image = galleryItems[currentIndex].querySelector("img");

    if (!image) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "KBK Luxury Apartments";

    if (counter) {
      counter.textContent =
        `${currentIndex + 1} / ${galleryItems.length}`;
    }
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;

    previousFocus = document.activeElement;

    displayImage(index);

    // Your CSS expects "open", not "active".
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-open");

    if (closeButton) closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeLightbox);
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      displayImage(currentIndex + 1);
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      displayImage(currentIndex - 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeLightbox();

    if (event.key === "ArrowRight") {
      displayImage(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      displayImage(currentIndex - 1);
    }
  });


  /* 6. SWIPE THROUGH GALLERY ON MOBILE */

  let touchStartX = 0;
  let touchStartY = 0;

  if (lightboxImage) {
    lightboxImage.addEventListener("touchstart", event => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    lightboxImage.addEventListener("touchend", event => {
      const deltaX =
        event.changedTouches[0].clientX - touchStartX;

      const deltaY =
        event.changedTouches[0].clientY - touchStartY;

      if (
        Math.abs(deltaX) > 50 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        displayImage(currentIndex + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

/* =========================================
   KBK GALLERY LIGHTBOX — FIX
========================================= */
(() => {
  const grid = document.querySelector(".gallery-grid");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.querySelector(".gallery-close");
  const prevButton = document.querySelector(".gallery-prev");
  const nextButton = document.querySelector(".gallery-next");
  const counter = document.getElementById("galleryCounter");

  if (!grid || !lightbox || !lightboxImage) {
    console.error("Gallery setup error: required HTML elements are missing.");
    return;
  }

  const items = Array.from(grid.querySelectorAll(".gallery-item"));
  let currentIndex = 0;

  function showImage(index) {
    if (!items.length) return;

    currentIndex = (index + items.length) % items.length;

    const thumbnail = items[currentIndex].querySelector("img");
    if (!thumbnail) return;

    lightboxImage.src = thumbnail.currentSrc || thumbnail.src;
    lightboxImage.alt = thumbnail.alt || "Gallery photo";
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${items.length}`;
    }
  }

  function openGallery(index) {
    showImage(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (closeButton) closeButton.focus();
  }

  function closeGallery() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Open the clicked thumbnail.
  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".gallery-item");
    if (!button || !grid.contains(button)) return;

    const index = items.indexOf(button);
    if (index !== -1) openGallery(index);
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeGallery);
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showImage(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showImage(currentIndex + 1);
    });
  }

  // Clicking the dark background closes the gallery.
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeGallery();
  });

  // Keyboard controls.
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  console.log(`KBK gallery ready: ${items.length} photos found.`);
})();


});


/* =====================================
   KBK HOSPITALITY — WEBSITE INTERACTIONS
===================================== */

// MOBILE NAVIGATION
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

// AUTOMATIC FOOTER YEAR
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// GALLERY ELEMENTS
const galleryItems = Array.from(
  document.querySelectorAll(".gallery-item")
);

const lightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const galleryCounter = document.getElementById("galleryCounter");

const closeGalleryButton = document.querySelector(".gallery-close");
const previousPhotoButton = document.querySelector(".gallery-prev");
const nextPhotoButton = document.querySelector(".gallery-next");

let currentPhotoIndex = 0;
let lastFocusedElement = null;
let touchStartX = 0;
let touchStartY = 0;

// DISPLAY A SELECTED PHOTO
function showGalleryPhoto(index) {
  if (!galleryItems.length || !lightboxImage || !galleryCounter) {
    return;
  }

  currentPhotoIndex =
    (index + galleryItems.length) % galleryItems.length;

  const thumbnail =
    galleryItems[currentPhotoIndex].querySelector("img");

  if (!thumbnail) return;

  lightboxImage.src = thumbnail.currentSrc || thumbnail.src;
  lightboxImage.alt = thumbnail.alt || "KBK Luxury Apartments photo";

  galleryCounter.textContent =
    `${currentPhotoIndex + 1} / ${galleryItems.length}`;
}

// OPEN GALLERY
function openGallery(index) {
  if (!lightbox || !galleryItems.length) return;

  lastFocusedElement = document.activeElement;

  showGalleryPhoto(index);

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("gallery-open");

  if (closeGalleryButton) {
    closeGalleryButton.focus();
  }
}

// CLOSE GALLERY
function closeGalleryViewer() {
  if (!lightbox) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("gallery-open");

  if (lastFocusedElement && lastFocusedElement.focus) {
    lastFocusedElement.focus();
  }
}

// NEXT AND PREVIOUS
function showPreviousPhoto() {
  showGalleryPhoto(currentPhotoIndex - 1);
}

function showNextPhoto() {
  showGalleryPhoto(currentPhotoIndex + 1);
}

// CONNECT GALLERY THUMBNAILS
galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    openGallery(index);
  });
});

// CONNECT GALLERY BUTTONS
if (previousPhotoButton) {
  previousPhotoButton.addEventListener("click", showPreviousPhoto);
}

if (nextPhotoButton) {
  nextPhotoButton.addEventListener("click", showNextPhoto);
}

if (closeGalleryButton) {
  closeGalleryButton.addEventListener("click", closeGalleryViewer);
}

// CLOSE WHEN CLICKING OUTSIDE THE PHOTO
if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeGalleryViewer();
    }
  });
}

// KEYBOARD SUPPORT
document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeGalleryViewer();
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showNextPhoto();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPreviousPhoto();
  }
});

// SWIPE SUPPORT ON MOBILE
if (lightbox) {
  lightbox.addEventListener(
    "touchstart",
    (event) => {
      if (!event.touches.length) return;

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      if (!event.changedTouches.length) return;

      const differenceX =
        event.changedTouches[0].clientX - touchStartX;

      const differenceY =
        event.changedTouches[0].clientY - touchStartY;

      if (
        Math.abs(differenceX) > 55 &&
        Math.abs(differenceX) > Math.abs(differenceY)
      ) {
        if (differenceX < 0) {
          showNextPhoto();
        } else {
          showPreviousPhoto();
        }
      }
    },
    { passive: true }
  );
}

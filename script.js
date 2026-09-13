// =========================================================
// OWNER LOGIN + EDIT MODE
// -----------------------------------------------------------
// IMPORTANT (read this before changing the password below):
// This site is hosted on GitHub Pages, which only serves files —
// there is no server or database. So this "login" only checks the
// password inside THIS file, and any edits (price text, replacement
// photos) are saved in the browser's own storage (localStorage) —
// meaning edits only show up again on the SAME browser/device that
// made them. Good enough for a demo or personal use; if you want
// every visitor to see the same saved edits, you'd need a real
// backend (ask about this any time).
// =========================================================

const OWNER_PASSWORD = 'naiposha2026'; // <-- change this to your own password

const ownerLockBtn   = document.getElementById('ownerLockBtn');
const ownerBanner    = document.getElementById('ownerBanner');
const ownerLogoutBtn = document.getElementById('ownerLogoutBtn');
const loginModal     = document.getElementById('loginModal');
const loginModalClose= document.getElementById('loginModalClose');
const loginForm      = document.getElementById('loginForm');
const loginError     = document.getElementById('loginError');

// --- Open / close the login modal ---
ownerLockBtn.addEventListener('click', () => { loginModal.hidden = false; });
loginModalClose.addEventListener('click', () => { loginModal.hidden = true; });

// --- Check the password when the login form is submitted ---
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading
  const typed = document.getElementById('ownerPassword').value;
  if (typed === OWNER_PASSWORD) {
    sessionStorage.setItem('naiposhaOwner', 'true'); // stays logged in until tab closes
    loginModal.hidden = true;
    loginError.hidden = true;
    loginForm.reset();
    enableOwnerMode();
  } else {
    loginError.hidden = false;
  }
});

// --- Log out ---
ownerLogoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('naiposhaOwner');
  disableOwnerMode();
});

function enableOwnerMode() {
  document.body.classList.add('owner-mode');
  ownerBanner.hidden = false;

  // Make every price span editable directly on the page
  document.querySelectorAll('.owner-editable-text').forEach(el => {
    el.contentEditable = 'true';
    // Save to localStorage whenever the owner finishes editing a price
    el.addEventListener('blur', () => {
      const key = 'price-' + getElementPath(el);
      localStorage.setItem(key, el.textContent);
    });
  });

  // Make every product/gallery image clickable to replace it
  document.querySelectorAll('.owner-editable-img').forEach(img => {
    img.addEventListener('click', () => triggerImageUpload(img));
  });
}

function disableOwnerMode() {
  document.body.classList.remove('owner-mode');
  ownerBanner.hidden = true;
  document.querySelectorAll('.owner-editable-text').forEach(el => {
    el.contentEditable = 'false';
  });
}

// Give each editable element a unique "path" so we can find it again next visit
function getElementPath(el) {
  const all = Array.from(document.querySelectorAll('.owner-editable-text'));
  return all.indexOf(el);
}
function getImagePath(img) {
  const all = Array.from(document.querySelectorAll('.owner-editable-img'));
  return all.indexOf(img);
}

// Opens the device's file picker, then converts the chosen photo into
// a Base64 text string so it can be stored in localStorage and reloaded later
function triggerImageUpload(img) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      const key = 'img-' + getImagePath(img);
      localStorage.setItem(key, reader.result);
    };
    reader.readAsDataURL(file);
  });
  fileInput.click();
}

// --- On page load: restore any saved edits, and stay logged in if applicable ---
document.querySelectorAll('.owner-editable-text').forEach((el, i) => {
  const saved = localStorage.getItem('price-' + i);
  if (saved) el.textContent = saved;
});
document.querySelectorAll('.owner-editable-img').forEach((img, i) => {
  const saved = localStorage.getItem('img-' + i);
  if (saved) img.src = saved;
});
if (sessionStorage.getItem('naiposhaOwner') === 'true') {
  enableOwnerMode();
}

// =========================================================
// 0. HERO SLIDESHOW (auto-rotating fade)
// =========================================================
const heroSlides = document.querySelectorAll('#heroSlideshow .hero-slide');
if (heroSlides.length > 1) {
  let currentSlide = 0;
  setInterval(() => {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 4000); // change photo every 4 seconds
}

// =========================================================
// 1. MOBILE NAVIGATION TOGGLE
// =========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =========================================================
// 2. FOOTER YEAR
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// 3. BREED ADVISOR
// This is a simple "if/else" recommendation tool. It looks at
// the two dropdown values the visitor picked, and matches them
// against a small set of written recommendations below.
//
// To add more recommendations, add more "if" blocks following
// the same pattern: check farmSize and farmGoal, then set
// resultBox.textContent to your advice.
// =========================================================
const advisorForm = document.getElementById('advisorForm');
const advisorResult = document.getElementById('advisorResult');

advisorForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const size = document.getElementById('farmSize').value; // "small" | "medium" | "large"
  const goal = document.getElementById('farmGoal').value; // "milk" | "meat" | "eggs" | "starting"

  let recommendation = '';

  if (goal === 'milk') {
    recommendation = size === 'small'
      ? 'With a small plot, start with 1–2 Ayrshire dairy cows — they need less pasture than Friesians and still give a good daily yield.'
      : 'Friesian cattle are a strong choice for medium to large dairy operations — high yield, and you have the land to support proper pasture rotation.';
  } else if (goal === 'meat') {
    recommendation = 'For meat production, broiler poultry gives the fastest return, especially if you are just starting out with limited land.';
  } else if (goal === 'eggs') {
    recommendation = 'A layer flock is a great fit — start with 20–50 birds on a small plot, or scale up to a few hundred on medium/large land.';
  } else {
    recommendation = 'Starting out, poultry (layers or broilers) is the easiest entry point — lower cost, faster turnaround, and a good way to learn before investing in cattle.';
  }

  advisorResult.textContent = recommendation;
});

// =========================================================
// 4. FAQ ACCORDION
// Clicking a question toggles the "open" class on its parent
// .faq-item, which the CSS uses to expand/collapse the answer.
// =========================================================
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    item.classList.toggle('open');
  });
});

// =========================================================
// 5. PRODUCT CATEGORY FILTER
// Each filter button has a data-filter value ("all", "cattle",
// "poultry", "dairy", "produce"). Each product card has a
// matching data-category value. Clicking a tab shows only the
// cards whose category matches (or all of them, for "all").
// =========================================================
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');
const filterEmpty = document.getElementById('filterEmpty');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Highlight the clicked tab, un-highlight the rest
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const chosenCategory = tab.dataset.filter; // e.g. "cattle"
    let visibleCount = 0;

    productCards.forEach(card => {
      const matches = chosenCategory === 'all' || card.dataset.category === chosenCategory;
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    filterEmpty.hidden = visibleCount !== 0;
  });
});

// =========================================================
// 6. GALLERY LIGHTBOX
// Clicking any gallery image opens a full-screen preview.
// The prev/next buttons step through the same list of images
// the gallery grid has, so visitors can browse without closing.
// =========================================================
const galleryButtons = document.querySelectorAll('.gallery-item');
const galleryImages = Array.from(galleryButtons).map(btn => btn.querySelector('img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentImageIndex = 0;

function openLightbox(index) {
  currentImageIndex = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
}

function showImage(step) {
  // step is +1 (next) or -1 (previous); % wraps around the list
  currentImageIndex = (currentImageIndex + step + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImageIndex].src;
  lightboxImg.alt = galleryImages[currentImageIndex].alt;
}

galleryButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => openLightbox(index));
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showImage(-1));
lightboxNext.addEventListener('click', () => showImage(1));

// Close the lightbox if the visitor clicks the dark background itself
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

// Keyboard support: Escape closes, arrow keys navigate
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(-1);
  if (event.key === 'ArrowRight') showImage(1);
});

// =========================================================
// 7. BACK TO TOP BUTTON
// Hidden until the visitor scrolls down 400px, then fades in.
// =========================================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.hidden = window.scrollY < 400;
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================================
// 8. CONTACT FORM
// Static site — no backend yet. See the note left in the HTML
// about connecting Formspree or EmailJS for real email delivery.
// =========================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  formStatus.textContent =
    `Thanks, ${name}! This form isn't connected to an inbox yet — ` +
    `use the WhatsApp button above for a faster reply in the meantime.`;
  contactForm.reset();
});

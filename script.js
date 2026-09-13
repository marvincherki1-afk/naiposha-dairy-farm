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

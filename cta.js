/* Adds "Order now on WhatsApp", "View products", "Call now" and the Call/SMS line to every section. */
(function () {
  var WA = "254755606947";            /* WhatsApp number */
  var CALL1 = "+254755606947";        /* main number */
  var CALL2 = "+254794777055";        /* additional call / SMS number */

  function wa(msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }

  /* 1. Every section on the page */
  document.querySelectorAll("body > section").forEach(function (sec) {
    var target = sec.querySelector(".hero-text, .about-text, .band-text, .contact-text") || sec.firstElementChild;
    if (!target) return;

    /* remove the old hero / contact buttons so we don't show duplicates */
    target.querySelectorAll(".hero-actions, .contact-actions").forEach(function (old) { old.remove(); });

    var viewLink = sec.id === "products" ? "#productGrid" : "#products";
    var box = document.createElement("div");
    box.innerHTML =
      '<div class="section-cta">' +
        '<a class="cta-btn" target="_blank" rel="noopener" href="' + wa("Hi Nai'Posha, I'd like to order") + '">Order now on WhatsApp</a>' +
        '<a class="cta-btn" href="' + viewLink + '">View products</a>' +
        '<a class="cta-btn" href="tel:' + CALL1 + '">Call now</a>' +
      '</div>' +
      '<p class="contact-strip">Call / SMS: ' +
        '<a href="tel:' + CALL1 + '">0755 606 947</a>' +
        '<a href="tel:' + CALL2 + '">0794 777 055</a>' +
        '<a href="sms:' + CALL2 + '">Send SMS</a></p>';
    target.appendChild(box);
  });

  /* 2. Every product card gets its own order + call buttons */
  document.querySelectorAll(".product-card .product-body").forEach(function (body) {
    var name = body.querySelector("h3").textContent;
    var div = document.createElement("div");
    div.className = "card-actions";
    div.innerHTML =
      '<a class="cta-btn" target="_blank" rel="noopener" href="' + wa("Hi Nai'Posha, I'd like to order: " + name) + '">Order now on WhatsApp</a>' +
      '<a class="cta-btn" href="tel:' + CALL1 + '">Call now</a>';
    body.appendChild(div);
  });
})();

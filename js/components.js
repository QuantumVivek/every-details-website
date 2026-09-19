import { icon } from "./icons.js?v=6";
import { api } from "./api.js?v=6";

function telHref(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

export function renderTopbar(site) {
  return `
    <div class="topbar">
      <div class="topbar-inner">
        <div class="topbar-contacts">
          <a href="tel:${telHref(site.phone)}">${icon("phone")} ${site.phone}</a>
          ${site.phoneAlt ? `<a href="tel:${telHref(site.phoneAlt)}">${icon("phone")} ${site.phoneAlt}</a>` : ""}
          <a class="topbar-email" href="mailto:${site.email}">${icon("mail")} ${site.email}</a>
          <span class="topbar-address">${icon("pin")} ${site.address}</span>
        </div>
        <div class="topbar-follow">
          <span>Follow Us:</span>
          <div class="socials">
            <a href="${site.socials.facebook}" target="_blank" rel="noreferrer" aria-label="Facebook">${icon("facebook")}</a>
            <a href="${site.socials.instagram}" target="_blank" rel="noreferrer" aria-label="Instagram">${icon("instagram")}</a>
            <a href="${site.socials.linkedin}" target="_blank" rel="noreferrer" aria-label="LinkedIn">${icon("linkedin")}</a>
            <a href="${site.socials.youtube}" target="_blank" rel="noreferrer" aria-label="YouTube">${icon("youtube")}</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderHeader(site, active) {
  const links = [
    ["/", "home", "Home"],
    ["/courses", "courses", "Courses"],
    ["/colleges", "colleges", "Colleges"],
    ["/about", "about", "About Us"],
    ["/contact", "contact", "Contact"],
  ];

  return `
    <header class="nav" id="nav">
      <div class="container nav-inner">
        <a class="logo" href="/">
          <img class="logo-img" src="images/logo.png?v=3" alt="Every Details Education Consultancy" />
        </a>
        <ul class="nav-links" id="nav-links">
          ${links
            .map(
              ([href, id, label]) =>
                `<li><a class="${active === id ? "active" : ""}" href="${href}">${label}</a></li>`
            )
            .join("")}
        </ul>
        <div class="nav-actions">
          <a class="btn btn-gold nav-cta" href="/contact">Get Free Counseling ${icon("arrow")}</a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function renderFooter(site) {
  return `
    <section class="cta-banner">
      <div class="container cta-inner">
        <span class="cta-plane" aria-hidden="true">${icon("send")}</span>
        <div>
          <h2>TAKE THE FIRST STEP TOWARDS YOUR DREAM</h2>
          <p>Get Free Career Counseling Today.</p>
        </div>
        <a class="btn btn-gold" href="/contact">Contact Us Now ${icon("arrow")}</a>
      </div>
    </section>
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo logo-footer" href="/">
            <img class="logo-img" src="images/logo.png?v=3" alt="Every Details Education Consultancy" />
          </a>
          <p>${site.tagline}. Honest counselling, complete admission support, and a brighter academic future.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/colleges">Colleges</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact Us</h4>
          <ul class="footer-contact">
            <li><a href="tel:${telHref(site.phone)}">${icon("phone")} ${site.phone}</a></li>
            ${site.phoneAlt ? `<li><a href="tel:${telHref(site.phoneAlt)}">${icon("phone")} ${site.phoneAlt}</a></li>` : ""}
            <li><a href="mailto:${site.email}">${icon("mail")} ${site.email}</a></li>
            <li>${icon("pin")} ${site.address}</li>
          </ul>
        </div>
        <div>
          <h4>Get Updates on WhatsApp</h4>
          <p>Admission updates aapke number par milenge.</p>
          <form class="newsletter" id="newsletter-form">
            <input type="tel" name="phone" inputmode="tel" autocomplete="tel" placeholder="Enter your phone number" required />
            <button type="submit" aria-label="Send number">${icon("send")}</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2014 ${site.shortName || site.name}. All Rights Reserved.</span>
        <a class="footer-credit" href="https://www.pixelsinframe.in" target="_blank" rel="noreferrer">Created by pixelsinframe.in</a>
        <nav class="footer-legal" aria-label="Legal">
          <a href="/privacy">Privacy Policy</a>
          <span aria-hidden="true">•</span>
          <a href="/terms">Terms &amp; Conditions</a>
        </nav>
      </div>
    </footer>
  `;
}

export function courseCard(course, index = 0) {
  return `
    <a class="course-card" id="${course.slug}" href="/contact?course=${encodeURIComponent(course.title)}" style="--i:${Math.min(index, 7)}">
      <div class="course-media">
        <img src="${course.image}" alt="${course.fullName}" loading="lazy" />
      </div>
      <div class="course-body">
        <div class="course-icon">${icon(course.icon)}</div>
        <h3>${course.title}</h3>
        <p>${course.fullName}</p>
      </div>
      <span class="course-go">${icon("arrow")}</span>
    </a>
  `;
}

export function bindLayoutEvents(site = {}) {
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  const nav = document.getElementById("nav");

  const closeMenu = () => {
    links?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    links?.classList.add("open");
    toggle?.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  toggle?.addEventListener("click", () => {
    if (links?.classList.contains("open")) closeMenu();
    else openMenu();
  });

  links?.querySelectorAll("a").forEach((item) => item.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
  window.addEventListener("scroll", () => {
    nav?.classList.toggle("scrolled", window.scrollY > 8);
  });

  document.getElementById("newsletter-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const phone = String(new FormData(form).get("phone") || "").trim();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      showToast("Please enter a valid phone number.");
      return;
    }
    try {
      const result = await api.subscribe(phone);
      showToast(result.message || "Number WhatsApp par bheja ja raha hai.");
      const number = String(site.inquiryWhatsapp || "918271583752").replace(/[^\d]/g, "");
      const text = ["New WhatsApp update request", `Phone: ${phone}`].join("\n");
      const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
      const popup = window.open(url, "_blank", "noopener");
      if (!popup) window.location.href = url;
      form.reset();
    } catch (error) {
      const number = String(site.inquiryWhatsapp || "918271583752").replace(/[^\d]/g, "");
      const text = ["New WhatsApp update request", `Phone: ${phone}`].join("\n");
      const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
      showToast("WhatsApp khul gaya hai. Send dabakar number bhej den.");
    }
  });
}

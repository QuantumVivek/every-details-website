export function bindPageAnimations() {
  const topbar = document.querySelector(".topbar");
  const nav = document.querySelector(".nav");
  topbar?.classList.add("chrome-in");
  nav?.classList.add("chrome-in");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reduce-motion");
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
    return;
  }

  document.documentElement.classList.add("js-anim");

  const items = new Set();

  const mark = (el, extraClass) => {
    if (!el || el.closest(".hero")) return;
    el.classList.add("reveal");
    if (extraClass) el.classList.add(extraClass);
    items.add(el);
  };

  const singles = [
    [".page-hero .container", ""],
    [".section-head", ""],
    [".about-photo", "reveal-left"],
    [".about-copy", "reveal-right"],
    [".why-photo", "reveal-left"],
    [".why-content > .eyebrow, .why-content > h2, .why-content > .section-sub", "reveal-right"],
    [".form", "reveal-right"],
    [".map-wrap", ""],
    [".college-credit", ""],
    [".cta-inner", ""],
    [".footer-grid > *", ""],
  ];

  singles.forEach(([selector, extra]) => {
    document.querySelectorAll(selector).forEach((el) => mark(el, extra));
  });

  document.querySelectorAll(".contact-grid > div:first-child > .contact-card").forEach((el, i) => {
    el.style.setProperty("--i", String(i));
    mark(el, "");
  });

  const staggerParents = [
    ".courses-grid",
    ".detail-grid",
    ".process",
    ".stats",
    ".stories-grid",
    ".why-points",
  ];

  staggerParents.forEach((selector) => {
    document.querySelectorAll(selector).forEach((parent) => {
      if (parent.closest(".hero")) return;
      [...parent.children].forEach((child, i) => {
        child.style.setProperty("--i", String(Math.min(i, 11)));
        mark(child, "");
      });
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
  );

  items.forEach((el) => io.observe(el));
}

import { api } from "../api.js?v=6";
import { icon } from "../icons.js?v=6";

export async function renderAbout(root) {
  const [site, stats, whyChoose] = await Promise.all([
    api.getSite(),
    api.getStats(),
    api.getWhyChoose(),
  ]);

  root.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">ABOUT US</span>
        <h1>${site.name}</h1>
        <p>Muzaffarpur-based counselling for Indian universities — regular and correspondence, with every file handled.</p>
      </div>
    </section>
    <section class="section">
      <div class="container about-grid">
        <div class="about-photo">
          <div class="about-shape">
            <img src="${site.about.image}" alt="Students on campus" />
          </div>
        </div>
        <div class="about-copy">
          <h2>Your Trusted Education Partner</h2>
          <p class="section-sub">Your Success, Our Commitment</p>
          <p>${site.about.text}</p>
          <p>We work only in India. Counsellors review your marks and budget, shortlist Indian universities, complete applications, and follow up until the seat is confirmed.</p>
        </div>
        <div class="stats">
          ${stats
            .map(
              (item) => `
            <div class="stat">
              <span class="stat-icon">${icon(item.icon)}</span>
              <span>${item.label}</span>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section stories">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">HOW WE HELP</span>
            <h2>OUR PROCESS</h2>
            <p class="section-sub">Simple, transparent, and student-first.</p>
          </div>
        </div>
        <div class="process">
          <article class="process-item"><b>1</b><h3>Free Counselling</h3><p>Share your course interest, marks, city, and budget.</p></article>
          <article class="process-item"><b>2</b><h3>College Match</h3><p>We shortlist Indian universities that actually fit you.</p></article>
          <article class="process-item"><b>3</b><h3>File & Apply</h3><p>Documents, forms, and university follow-up — with you.</p></article>
          <article class="process-item"><b>4</b><h3>Seat Confirmation</h3><p>We stay on it until the admission letter is in your hand.</p></article>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">WHY STUDENTS TRUST US</span>
            <h2>WHAT SETS US APART</h2>
          </div>
        </div>
        <div class="detail-grid">
          ${whyChoose
            .map(
              (item) => `
            <article class="detail-card">
              <div class="course-icon">${icon(item.icon)}</div>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

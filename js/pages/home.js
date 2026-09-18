import { api } from "../api.js?v=6";
import { icon } from "../icons.js?v=6";
import { courseCard } from "../components.js?v=6";

function campusSvg() {
  return `
    <svg class="campus" viewBox="0 0 180 130" fill="none" aria-hidden="true">
      <path d="M16 118h148" stroke="#9bb8dc" stroke-width="3" opacity=".55"/>
      <path d="M28 118V58l62-34 62 34v60" stroke="#9bb8dc" stroke-width="3" opacity=".5"/>
      <path d="M70 118V82h40v36" stroke="#9bb8dc" stroke-width="3" opacity=".5"/>
      <path d="M48 72h18M114 72h18M48 86h18M114 86h18" stroke="#9bb8dc" stroke-width="2" opacity=".45"/>
    </svg>
  `;
}

export async function renderHome(root) {
  const [site, courses, testimonials, stats, whyChoose] = await Promise.all([
    api.getSite(),
    api.getCourses(),
    api.getTestimonials(),
    api.getStats(),
    api.getWhyChoose(),
  ]);

  const hero = site.hero;
  const about = site.about;

  root.innerHTML = `
    <section class="hero">
      <div class="hero-sky" aria-hidden="true"></div>
      <div class="hero-blob hero-blob-left" aria-hidden="true"></div>
      <div class="hero-blob hero-blob-right" aria-hidden="true"></div>
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="pills">
            <span class="pill pill-blue">${hero.kickerLeft}</span>
            <span class="pill pill-gold">${hero.kickerRight}</span>
          </div>
          <h1>${hero.title}</h1>
          <h2>${hero.subtitle}</h2>
          <p>${hero.text}</p>
          <div class="hero-actions">
            <a class="btn btn-navy" href="/courses">Explore Courses ${icon("arrow")}</a>
            <a class="btn btn-outline" href="/contact">Free Career Counseling</a>
          </div>
        </div>
        <div class="hero-visual">
          ${campusSvg()}
          <div class="hero-photo">
            <img src="${hero.image}" alt="Graduate ready for admission in an Indian university" />
          </div>
          <span class="script-note">Your Dream Our <em>Priority</em></span>
        </div>
      </div>
      <div class="container hero-features">
        <div class="features">
          ${site.features
            .map(
              (item) => `
            <div class="feature">
              <span class="feature-icon">${icon(item.icon)}</span>
              <span>${item.label}</span>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section courses-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">OUR POPULAR COURSES</span>
            <h2>COURSES WE OFFER</h2>
            <p class="section-sub">BA, B.Com, B.Tech, MBA, B.Ed, LLB and more — regular & correspondence.</p>
          </div>
          <a class="btn btn-navy" href="/courses">View All Courses ${icon("arrow")}</a>
        </div>
        <div class="courses-grid">
          ${courses.map((course, index) => courseCard(course, index)).join("")}
        </div>
        <p class="college-credit">Course photographs are from Wikimedia Commons and used under Creative Commons licenses.</p>
      </div>
    </section>

    <section class="why">
      <div class="why-grid">
        <div class="why-photo">
          <img src="${about.whyImage}" alt="Study books and graduation cap" />
        </div>
        <div class="why-content">
          <span class="eyebrow">WHY CHOOSE US</span>
          <h2>YOUR TRUSTED EDUCATION PARTNER</h2>
          <span class="section-sub">Guiding You to the Right Path</span>
          <div class="why-points">
            ${whyChoose
              .map(
                (item) => `
              <article class="why-point">
                <span>${icon(item.icon)}</span>
                <div>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </div>
              </article>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container about-grid">
        <div class="about-photo">
          <div class="about-shape">
            <img src="${about.image}" alt="Students walking together on campus" />
          </div>
        </div>
        <div class="about-copy">
          <span class="eyebrow">ABOUT US</span>
          <h2>${site.name}</h2>
          <p class="section-sub">Your Success, Our Commitment</p>
          <p>${about.text}</p>
          <a class="btn btn-navy" href="/about">Know More About Us ${icon("arrow")}</a>
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
            <span class="eyebrow">WHAT OUR STUDENTS SAY</span>
            <h2>SUCCESS STORIES</h2>
            <p class="section-sub">Real Dreams. Real Achievements.</p>
          </div>
        </div>
        <div class="stories-grid">
          ${testimonials
            .map(
              (item) => `
            <article class="story-card">
              <div class="story-top">
                <span class="story-avatar" aria-hidden="true">${item.initials}</span>
                <div>
                  <h4>${item.name}</h4>
                  <div class="meta">${item.meta}</div>
                </div>
              </div>
              <blockquote>“${item.quote}”</blockquote>
              <div class="stars">★★★★★</div>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

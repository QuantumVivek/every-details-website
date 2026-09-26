import { api } from "../api.js?v=6";
import { icon } from "../icons.js?v=6";

export async function renderColleges(root) {
  const colleges = await api.getColleges();

  root.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">INDIAN UNIVERSITIES</span>
        <h1>COLLEGES WE GUIDE FOR</h1>
        <p>Admission counselling for Indian universities only. We help you shortlist, apply, and prepare documents — we do not claim exclusive tie-ups unless confirmed with you in counselling.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="detail-grid">
          ${colleges
            .map(
              (college, index) => `
            <article class="detail-card college-card" id="${college.slug}" style="--i:${index}">
              <div class="college-media">
                <img src="${college.image}" alt="${college.name} — ${college.city}" loading="lazy" />
                <span class="college-country">${college.country}</span>
              </div>
              <div class="college-body">
                <h3>${college.name}</h3>
                <p class="meta">${college.city}</p>
                <p>${college.focus}</p>
                <a class="btn btn-navy" href="/contact?course=${encodeURIComponent(college.name)}">Ask About Admission ${icon("arrow")}</a>
              </div>
            </article>`
            )
            .join("")}
        </div>
        <section class="many-more">
          <span class="eyebrow">AND THAT IS NOT ALL</span>
          <h2>MANY MORE</h2>
          <p>These universities are only a start. We also guide admissions for many more Indian colleges — regular and correspondence. Tell us the one you want.</p>
          <a class="btn btn-navy" href="/contact">Ask About Your College ${icon("arrow")}</a>
        </section>
      </div>
    </section>
  `;
}

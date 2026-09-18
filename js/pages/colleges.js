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
        <p class="college-credit">Photographs are from Wikimedia Commons and used under Creative Commons licenses. Where an official campus photo is not available under a free licence, a representative education photo is shown. Photos are for guidance only and do not imply exclusive university partnerships.</p>
      </div>
    </section>
  `;
}

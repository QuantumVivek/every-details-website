import { api } from "../api.js?v=6";
import { icon } from "../icons.js?v=6";
import { showToast } from "../components.js?v=12";

function sendInquiryOnWhatsApp(data, whatsappNumber) {
  const number = String(whatsappNumber || "918271583752").replace(/[^\d]/g, "");
  const lines = [
    "New counselling inquiry",
    `Name: ${data.name || ""}`,
    `Phone: ${data.phone || ""}`,
    `Email: ${data.email || ""}`,
    `Course: ${data.course || ""}`,
    `Message: ${data.message || ""}`,
  ];
  const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function renderContact(root) {
  const [site, courses] = await Promise.all([api.getSite(), api.getCourses()]);
  const selected = new URLSearchParams(window.location.search).get("course") || "";

  root.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">GET IN TOUCH</span>
        <h1>Free Career Counseling</h1>
        <p>Share your details and our counsellor will help you plan the next step.</p>
      </div>
    </section>
    <section class="section">
      <div class="container contact-grid">
        <div>
          <div class="contact-card">
            <span class="stat-icon">${icon("phone")}</span>
            <div>
              <h3>Phone</h3>
              <p><a href="tel:${String(site.phone || "").replace(/[^\d+]/g, "")}">${site.phone}</a></p>
              ${site.phoneAlt ? `<p><a href="tel:${String(site.phoneAlt || "").replace(/[^\d+]/g, "")}">${site.phoneAlt}</a></p>` : ""}
            </div>
          </div>
          <div class="contact-card">
            <span class="stat-icon">${icon("mail")}</span>
            <div>
              <h3>Email</h3>
              <p><a href="mailto:${site.email}">${site.email}</a></p>
            </div>
          </div>
          <div class="contact-card">
            <span class="stat-icon">${icon("pin")}</span>
            <div>
              <h3>Office</h3>
              <p>${site.address}</p>
            </div>
          </div>
          <div class="map-wrap">
            <iframe title="Muzaffarpur office map" src="https://maps.google.com/maps?q=Dumri%20Road%20Gobarsahi%20Muzaffarpur%20Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
          </div>
        </div>
        <form class="form" id="inquiry-form">
          <h2>Book a counselling session</h2>
          <div class="form-row">
            <div class="field">
              <label for="name">Full Name</label>
              <input id="name" name="name" required placeholder="Your name" />
            </div>
            <div class="field">
              <label for="phone">Phone</label>
              <input id="phone" name="phone" required placeholder="+91" />
            </div>
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@email.com" />
          </div>
          <div class="field">
            <label for="course">Preferred Course</label>
            <select id="course" name="course" required>
              <option value="">Select a course</option>
              ${courses
                .map(
                  (course) =>
                    `<option value="${course.title}" ${course.title === selected ? "selected" : ""}>${course.title} — ${course.fullName}</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" placeholder="Tell us your course, marks, city, and whether you want regular or correspondence"></textarea>
          </div>
          <button class="btn btn-navy" type="submit">Submit Inquiry ${icon("arrow")}</button>
          <p class="form-hint">Submit ke baad WhatsApp khulega. Poora form +91 82715 83752 par chala jayega — Send dabaana.</p>
          <p class="form-note" id="form-note"></p>
        </form>
      </div>
    </section>
  `;

  document.getElementById("inquiry-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const note = document.getElementById("form-note");
    const button = form.querySelector("button");
    button.disabled = true;

    sendInquiryOnWhatsApp(data, site.inquiryWhatsapp);
    note.textContent = "WhatsApp khul gaya hai. Send dabakar poori inquiry bhej den.";
    note.className = "form-note success";
    showToast("Poora form WhatsApp par ja raha hai.");
    api.sendInquiry(data).catch(() => {});
    form.reset();
    button.disabled = false;
  });
}

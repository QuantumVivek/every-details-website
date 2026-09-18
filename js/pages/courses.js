import { api } from "../api.js";
import { icon } from "../icons.js";
import { courseCard } from "../components.js";

export async function renderCourses(root) {
  const courses = await api.getCourses();
  const hash = window.location.hash.replace("#", "");

  root.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">OUR POPULAR COURSES</span>
        <h1>COURSES WE OFFER</h1>
        <p>Regular and correspondence programmes including BA, B.Com, B.Tech, MBA, B.Ed, LLB, ITI and more, with complete admission guidance.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="courses-grid">
          ${courses.map((course, index) => courseCard(course, index)).join("")}
        </div>
        <p class="college-credit">Course photographs are from Wikimedia Commons and used under Creative Commons licenses.</p>
      </div>
    </section>
  `;

  if (hash) {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

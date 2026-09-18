import { api } from "./api.js";
import { renderTopbar, renderHeader, renderFooter, bindLayoutEvents } from "./components.js";
import { bindPageAnimations } from "./animate.js";
import { renderHome } from "./pages/home.js";
import { renderCourses } from "./pages/courses.js";
import { renderAbout } from "./pages/about.js";
import { renderContact } from "./pages/contact.js";
import { renderColleges } from "./pages/colleges.js";

const pages = {
  home: renderHome,
  courses: renderCourses,
  colleges: renderColleges,
  about: renderAbout,
  contact: renderContact,
};

async function boot() {
  const page = document.body.dataset.page || "home";
  const topbar = document.getElementById("topbar");
  const header = document.getElementById("header");
  const main = document.getElementById("main");
  const footer = document.getElementById("footer");

  try {
    const sitePayload = await api.getSite();
    topbar.innerHTML = renderTopbar(sitePayload);
    header.innerHTML = renderHeader(sitePayload, page);
    footer.innerHTML = renderFooter(sitePayload);
    bindLayoutEvents(sitePayload);
    await pages[page](main);
    bindPageAnimations();
  } catch (error) {
    main.innerHTML = `
      <section class="section">
        <div class="container">
          <h2>Website could not load</h2>
          <p>${error.message}</p>
          <p>Start the local server so the JavaScript app can reach the backend API.</p>
        </div>
      </section>
    `;
  }
}

boot();

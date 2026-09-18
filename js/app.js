import { api } from "./api.js?v=6";
import { renderTopbar, renderHeader, renderFooter, bindLayoutEvents } from "./components.js?v=6";
import { bindPageAnimations } from "./animate.js?v=6";
import { renderHome } from "./pages/home.js?v=6";
import { renderCourses } from "./pages/courses.js?v=6";
import { renderAbout } from "./pages/about.js?v=6";
import { renderContact } from "./pages/contact.js?v=6";
import { renderColleges } from "./pages/colleges.js?v=6";

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
          <p>Please refresh the page. If it still does not open, wait a minute and try again.</p>
        </div>
      </section>
    `;
  }
}

boot();

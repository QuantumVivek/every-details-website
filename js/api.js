import { API_BASE } from "./config.js?v=6";

let dbCache = null;
let useStaticData = false;

async function getDb() {
  if (dbCache) return dbCache;
  const response = await fetch("/backend/db.json?v=6", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Website data could not load. Please refresh.");
  }
  dbCache = await response.json();
  return dbCache;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong. Please try again.");
  }

  return payload;
}

async function read(path, fromDb) {
  if (useStaticData) return fromDb(await getDb());
  try {
    return await request(path);
  } catch {
    useStaticData = true;
    return fromDb(await getDb());
  }
}

export const api = {
  getSite: () =>
    read("/site", (db) => ({
      ...db.site,
      hero: db.hero,
      about: db.about,
      features: db.features,
    })),
  getCourses: () => read("/courses", (db) => db.courses || []),
  getCourse: (slug) =>
    read(`/courses/${slug}`, (db) => {
      const course = (db.courses || []).find((item) => item.slug === slug);
      if (!course) throw new Error("Course not found");
      return course;
    }),
  getTestimonials: () => read("/testimonials", (db) => db.testimonials || []),
  getStats: () => read("/stats", (db) => db.stats || []),
  getWhyChoose: () => read("/why-choose", (db) => db.whyChoose || []),
  getColleges: () => read("/colleges", (db) => db.colleges || []),
  sendInquiry: async (body) => {
    try {
      return await request("/inquiries", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch {
      return { message: "Thank you. Our counsellor will contact you soon." };
    }
  },
  subscribe: async (phone) => {
    try {
      return await request("/newsletter", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
    } catch {
      return { message: "Number WhatsApp par bheja ja raha hai." };
    }
  },
};

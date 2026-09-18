import { API_BASE } from "./config.js";

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

export const api = {
  getSite: () => request("/site"),
  getCourses: () => request("/courses"),
  getCourse: (slug) => request(`/courses/${slug}`),
  getTestimonials: () => request("/testimonials"),
  getStats: () => request("/stats"),
  getWhyChoose: () => request("/why-choose"),
  getColleges: () => request("/colleges"),
  sendInquiry: (body) =>
    request("/inquiries", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  subscribe: (phone) =>
    request("/newsletter", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
};

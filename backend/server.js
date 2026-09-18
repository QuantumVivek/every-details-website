import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DB_PATH = path.join(__dirname, "db.json");
const INQUIRIES_PATH = path.join(__dirname, "inquiries.json");
const SUBSCRIBERS_PATH = path.join(__dirname, "subscribers.json");
const PORT = Number(process.env.PORT) || 5500;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const PUBLIC_PAGES = new Set([
  "/",
  "/index.html",
  "/courses.html",
  "/colleges.html",
  "/about.html",
  "/contact.html",
]);

const PUBLIC_DIRS = new Set(["css", "js", "images"]);

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function getDb() {
  return readJson(DB_PATH, {});
}

function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function isPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const db = await getDb();
  const route = url.pathname.replace(/\/$/, "") || "/";

  if (req.method === "GET" && route === "/api/site") {
    return json(res, 200, {
      ...db.site,
      hero: db.hero,
      about: db.about,
      features: db.features,
    });
  }

  if (req.method === "GET" && route === "/api/courses") {
    return json(res, 200, db.courses || []);
  }

  if (req.method === "GET" && route.startsWith("/api/courses/")) {
    const slug = route.split("/").pop();
    const course = (db.courses || []).find((item) => item.slug === slug);
    if (!course) return json(res, 404, { message: "Course not found" });
    return json(res, 200, course);
  }

  if (req.method === "GET" && route === "/api/colleges") {
    return json(res, 200, db.colleges || []);
  }

  if (req.method === "GET" && route === "/api/testimonials") {
    return json(res, 200, db.testimonials || []);
  }

  if (req.method === "GET" && route === "/api/stats") {
    return json(res, 200, db.stats || []);
  }

  if (req.method === "GET" && route === "/api/why-choose") {
    return json(res, 200, db.whyChoose || []);
  }

  if (req.method === "POST" && route === "/api/inquiries") {
    const body = await readBody(req);
    if (!body.name || !body.phone || !isEmail(body.email) || !body.course) {
      return json(res, 400, { message: "Please fill name, email, phone and course." });
    }
    const inquiries = await readJson(INQUIRIES_PATH, []);
    const inquiry = {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    inquiries.push(inquiry);
    await writeJson(INQUIRIES_PATH, inquiries);
    return json(res, 201, {
      message: "Thank you. Our counsellor will contact you soon.",
      inquiry,
    });
  }

  if (req.method === "POST" && route === "/api/newsletter") {
    const body = await readBody(req);
    if (!isPhone(body.phone)) {
      return json(res, 400, { message: "Please enter a valid phone number." });
    }
    const phone = String(body.phone).trim();
    const subscribers = await readJson(SUBSCRIBERS_PATH, []);
    if (!subscribers.some((item) => item.phone === phone || item.email === phone)) {
      subscribers.push({ phone, createdAt: new Date().toISOString() });
      await writeJson(SUBSCRIBERS_PATH, subscribers);
    }
    return json(res, 201, { message: "Number WhatsApp par bheja ja raha hai." });
  }

  return json(res, 404, { message: "API route not found" });
}

async function handleStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  const relative = pathname.replace(/^\/+/, "");
  const first = relative.split("/")[0];
  const isRootHtml = !relative.includes("/") && relative.endsWith(".html");
  const allowed = PUBLIC_PAGES.has(pathname) || PUBLIC_DIRS.has(first) || isRootHtml;
  if (!allowed) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const filePath = path.normalize(path.join(ROOT, relative));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await handleStatic(req, res, url);
  } catch (error) {
    json(res, 500, { message: error.message || "Server error" });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Every Detail website running at http://localhost:${PORT}`);
  console.log("Frontend: HTML + JavaScript");
  console.log("Backend API: /api/site /api/courses /api/colleges /api/inquiries /api/newsletter");
});

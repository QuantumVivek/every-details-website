import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DB_PATH = path.join(__dirname, "db.json");
const INQUIRIES_PATH = path.join(__dirname, "inquiries.json");
const SUBSCRIBERS_PATH = path.join(__dirname, "subscribers.json");
const PORT = process.env.PORT ?? 5500;

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.use("/api", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

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

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function isPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

async function persist(file, fallback, updater) {
  const current = await readJson(file, fallback);
  const next = updater(current);
  try {
    await writeJson(file, next);
  } catch (error) {
    console.error(`Could not write ${path.basename(file)}:`, error.message);
  }
  return next;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "every-details-api" });
});

app.get("/api/site", async (_req, res) => {
  const db = await getDb();
  res.json({
    ...db.site,
    hero: db.hero,
    about: db.about,
    features: db.features,
  });
});

app.get("/api/courses", async (_req, res) => {
  const db = await getDb();
  res.json(db.courses || []);
});

app.get("/api/courses/:slug", async (req, res) => {
  const db = await getDb();
  const course = (db.courses || []).find((item) => item.slug === req.params.slug);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

app.get("/api/colleges", async (_req, res) => {
  const db = await getDb();
  res.json(db.colleges || []);
});

app.get("/api/testimonials", async (_req, res) => {
  const db = await getDb();
  res.json(db.testimonials || []);
});

app.get("/api/stats", async (_req, res) => {
  const db = await getDb();
  res.json(db.stats || []);
});

app.get("/api/why-choose", async (_req, res) => {
  const db = await getDb();
  res.json(db.whyChoose || []);
});

app.post("/api/inquiries", async (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.phone || !isEmail(body.email) || !body.course) {
    return res.status(400).json({ message: "Please fill name, email, phone and course." });
  }
  const inquiry = {
    id: Date.now(),
    ...body,
    createdAt: new Date().toISOString(),
  };
  await persist(INQUIRIES_PATH, [], (inquiries) => {
    inquiries.push(inquiry);
    return inquiries;
  });
  res.status(201).json({
    message: "Thank you. Our counsellor will contact you soon.",
    inquiry,
  });
});

app.post("/api/newsletter", async (req, res) => {
  const body = req.body || {};
  if (!isPhone(body.phone)) {
    return res.status(400).json({ message: "Please enter a valid phone number." });
  }
  const phone = String(body.phone).trim();
  await persist(SUBSCRIBERS_PATH, [], (subscribers) => {
    if (!subscribers.some((item) => item.phone === phone || item.email === phone)) {
      subscribers.push({ phone, createdAt: new Date().toISOString() });
    }
    return subscribers;
  });
  res.status(201).json({ message: "Number WhatsApp par bheja ja raha hai." });
});

app.get("/backend/db.json", (_req, res) => {
  res.sendFile(DB_PATH);
});

const pages = {
  "/": "index.html",
  "/courses": "courses.html",
  "/colleges": "colleges.html",
  "/about": "about.html",
  "/contact": "contact.html",
  "/privacy": "privacy.html",
  "/terms": "terms.html",
};

Object.entries(pages).forEach(([route, file]) => {
  app.get(route, (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.sendFile(path.join(ROOT, file));
  });
});

app.use("/css", express.static(path.join(ROOT, "css")));
app.use("/js", express.static(path.join(ROOT, "js")));
app.use("/images", express.static(path.join(ROOT, "images")));

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((error, _req, res, _next) => {
  res.status(500).json({ message: error.message || "Server error" });
});

function start() {
  const listenCallback = () => {
    console.log(`Every Detail website running on port ${PORT}`);
    console.log("Backend API: /api/health /api/site /api/courses /api/colleges /api/inquiries /api/newsletter");
  };

  if (process.env.PORT) {
    app.listen(PORT, listenCallback);
  } else {
    app.listen(PORT, "0.0.0.0", listenCallback);
  }
}

start();

export default app;

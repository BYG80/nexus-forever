import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("ERROR: JWT_SECRET debe existir y tener al menos 32 caracteres.");
  process.exit(1);
}

const dbFile = path.resolve(__dirname, "..", process.env.DB_FILE || "./data/nexus.db");
fs.mkdirSync(path.dirname(dbFile), { recursive: true });
const db = new Database(dbFile);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    event_time TEXT,
    type TEXT NOT NULL DEFAULT 'Otro',
    description TEXT NOT NULL DEFAULT '',
    created_by INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id)
  );
`);

async function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn("AVISO: ADMIN_PASSWORD no está configurada. No se creará administrador automáticamente.");
    return;
  }

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (!existing) {
    const hash = await bcrypt.hash(password, 12);
    db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'admin')")
      .run(username, hash);
    console.log(`Administrador inicial creado: ${username}`);
  }
}
await ensureAdmin();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: false
}));

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Autenticación requerida." });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Sesión no válida o expirada." });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Se requieren permisos de administrador." });
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "nexus-forever" });
});

app.post("/api/auth/login", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
  }

  const user = db.prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?")
    .get(username);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

app.get("/api/auth/me", auth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/events", (req, res) => {
  const events = db.prepare(`
    SELECT id, title, event_date AS date, event_time AS time, type, description
    FROM events
    ORDER BY event_date ASC, event_time ASC, id ASC
  `).all();
  res.json({ events });
});

app.post("/api/events", auth, adminOnly, (req, res) => {
  const title = String(req.body?.title || "").trim();
  const date = String(req.body?.date || "").trim();
  const time = String(req.body?.time || "").trim();
  const type = String(req.body?.type || "Otro").trim();
  const description = String(req.body?.description || "").trim();

  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Título y fecha válida son obligatorios." });
  }

  const result = db.prepare(`
    INSERT INTO events (title, event_date, event_time, type, description, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, date, time, type, description, req.user.id);

  const event = db.prepare(`
    SELECT id, title, event_date AS date, event_time AS time, type, description
    FROM events WHERE id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json({ event });
});

app.put("/api/events/:id", auth, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido." });

  const title = String(req.body?.title || "").trim();
  const date = String(req.body?.date || "").trim();
  const time = String(req.body?.time || "").trim();
  const type = String(req.body?.type || "Otro").trim();
  const description = String(req.body?.description || "").trim();

  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Título y fecha válida son obligatorios." });
  }

  const result = db.prepare(`
    UPDATE events
    SET title = ?, event_date = ?, event_time = ?, type = ?, description = ?
    WHERE id = ?
  `).run(title, date, time, type, description, id);

  if (!result.changes) return res.status(404).json({ error: "Evento no encontrado." });
  const event = db.prepare(`
    SELECT id, title, event_date AS date, event_time AS time, type, description
    FROM events WHERE id = ?
  `).get(id);
  res.json({ event });
});

app.delete("/api/events/:id", auth, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido." });

  const result = db.prepare("DELETE FROM events WHERE id = ?").run(id);
  if (!result.changes) return res.status(404).json({ error: "Evento no encontrado." });

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`NEXUS Forever backend escuchando en http://localhost:${PORT}`);
});

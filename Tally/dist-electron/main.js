import { ipcMain, app, BrowserWindow } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Database from "better-sqlite3";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
console.log("Directory:", __dirname$1);
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let db;
function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "database.db");
  db = new Database(dbPath);
  db.prepare(`CREATE TABLE IF NOT EXISTS STYLE_MAPPING (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT DEFAULT 'default' NOT NULL
    )`).run();
  db.prepare(`CREATE TABLE IF NOT EXISTS TALLY_DB (
      id INTEGER PRIMARY KEY NOT NULL,
      name_1 TEXT NOT NULL,
      count_1 INT DEFAULT 0 NOT NULL,
      name_2 TEXT NOT NULL,
      count_2 INT DEFAULT 0 NOT NULL,
      name_1_mapping INT DEFAULT 1 NOT NULL,
      name_2_mapping INT DEFAULT 1 NOT NULL,
      FOREIGN KEY (name_1_mapping) REFERENCES STYLE_MAPPING (id),
      FOREIGN KEY (name_2_mapping) REFERENCES STYLE_MAPPING (id)
    )`).run();
}
ipcMain.handle("get-tables", async () => {
  if (!db) return [];
  return db.prepare(
    `
    SELECT name 
    FROM sqlite_schema 
    WHERE type='table' 
    ORDER BY name;`
  ).all();
});
ipcMain.handle("run-sql", async (_, sql) => {
  if (!db) return [];
  if (sql.toLowerCase().includes("select")) return db.prepare(`${sql}`).all();
  else if (sql.toLowerCase().includes("insert")) return db.prepare(`${sql}`).run();
  else if (sql.toLowerCase().includes("delete")) return db.prepare(`${sql}`).run();
  return "Failed to run, query didn't contain key argument";
});
ipcMain.handle("is-admin", () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Starting Application in Admin Mode");
    return true;
  }
  return false;
});
ipcMain.handle("get-tally", async () => {
  if (!db) return [];
  return db.prepare(`
    SELECT * FROM TALLY_DB
    `).all();
});
ipcMain.handle("get-mappings", async () => {
  if (!db) return [];
  return db.prepare(`
    SELECT * FROM STYLE_MAPPING
    `).all();
});
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "Tally_Icon.png"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  initDatabase();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};

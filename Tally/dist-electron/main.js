import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Database from "better-sqlite3";
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
  const res = db.prepare(`SELECT * FROM style_mapping WHERE name = 'default'`).all();
  if (res.length < 1) {
    db.prepare(`INSERT INTO style_mapping (name) VALUES ('default')`).run();
  }
}
function _instantiateBox(name) {
  if (!db) return [];
  console.log("Loading Box: ", name);
  db.prepare(`
    INSERT INTO style_mapping (name) SELECT ?
    WHERE NOT EXISTS (
      SELECT 1 FROM style_mapping where name = ?
    )
    `).run(name, name);
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
  else if (sql.toLowerCase().includes("update")) return db.prepare(`${sql}`).run();
  return "Failed to run, query didn't contain key argument";
});
ipcMain.handle("is-admin", () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Starting Application in Admin Mode");
    return true;
  }
  return false;
});
ipcMain.handle("get-mappings", async () => {
  if (!db) return [];
  return db.prepare(`
    SELECT * FROM STYLE_MAPPING
    `).all();
});
ipcMain.handle("create-tally", async (_, boardInfo) => {
  if (!db) return [];
  console.log("Incoming new Tally Board: ", boardInfo);
  let ids = [];
  ids.push(db.prepare(`SELECT id FROM style_mapping where name = ? LIMIT 1`).all(boardInfo.mapping_1)[0]);
  ids.push(db.prepare(`SELECT id FROM style_mapping where name = ? LIMIT 1`).all(boardInfo.mapping_2)[0]);
  console.log(ids);
  return db.prepare(`
    INSERT INTO TALLY_DB (
      name_1,
      name_2,
      name_1_mapping,
      name_2_mapping
    ) VALUES (
      ?,
      ?,
      ?,
      ?
    )
    `).run(boardInfo.name_1, boardInfo.name_2, ids[0].id, ids[1].id);
});
ipcMain.handle("get-allBoards", async () => {
  return db.prepare(`SELECT * FROM tally_db`).all();
});
ipcMain.handle("delete-boardById", async (_, id) => {
  if (!db) return [];
  console.log("Deleteing Board: ", id);
  return db.prepare(`
    DELETE FROM tally_db WHERE id = ?
    `).run(id);
});
ipcMain.handle("get-tally", async (_, id) => {
  if (!db) return [];
  return db.prepare(`
    SELECT * FROM TALLY_DB where id = ?
    `).all(id);
});
ipcMain.handle("get-mapping-names", async (_, mapping1, mapping2) => {
  if (!db) return [];
  let names = [];
  if (mapping1 === mapping2) {
    names.push(db.prepare(`
      SELECT name FROM style_mapping where id = ?
      LIMIT 1
    `).all(mapping1)[0]);
  } else {
    names.push(db.prepare(`SELECT name FROM style_mapping where id = ? LIMIT 1`).all(mapping1)[0]);
    names.push(db.prepare(`SELECT name FROM style_mapping where id = ? LIMIT 1`).all(mapping2)[0]);
  }
  console.log(names);
  return names;
});
ipcMain.handle("increment-count", async (_, id, isFirst) => {
  if (isFirst) return db.prepare(`UPDATE Tally_DB SET count_1 = count_1 + 1 WHERE id = ?`).run(id);
  return db.prepare(`UPDATE Tally_DB SET count_2 = count_2 + 1 WHERE id = ?`).run(id);
});
ipcMain.handle("subtract-count", async (_, id, isFirst) => {
  if (isFirst) return db.prepare(`UPDATE Tally_DB SET count_1 = count_1 - 1 WHERE id = ?`).run(id);
  return db.prepare(`UPDATE Tally_DB SET count_2 = count_2 - 1 WHERE id = ?`).run(id);
});
function boxLoading() {
  _instantiateBox("Red Square");
  _instantiateBox("Purple Square");
  _instantiateBox("Blue-Purple Gradient Square");
}
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "Tally_Icon.png"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    },
    width: 800,
    height: 600
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
  boxLoading();
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};

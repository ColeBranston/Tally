import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Database from 'better-sqlite3'
import { boardInfoType } from './preload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log("Directory:",__dirname)

//////////////////////////// Mongo implementation for later use ////////////////////////////
// // In main.js (Electron Main Process)
// const mongoose = require('mongoose');

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://colebranston:Sonic888!@bookingentries.mw84q.mongodb.net/');

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected to MongoDB!");
// });
////////////////////////////////////////////////////////////////////////////////////////////

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let db: Database.Database

function initDatabase() {
  // Now it's safe to call app.getPath
  const dbPath = path.join(app.getPath('userData'), 'database.db');
  db = new Database(dbPath);

  db.prepare(`CREATE TABLE IF NOT EXISTS STYLE_MAPPING (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT DEFAULT 'default' NOT NULL
    )`).run()
  
  db.prepare(`CREATE TABLE IF NOT EXISTS TALLY_DB (
      id INTEGER PRIMARY KEY NOT NULL,
      name_1 TEXT NOT NULL,
      count_1 INT DEFAULT 0 NOT NULL,
      name_2 TEXT NOT NULL,
      count_2 INT DEFAULT 0 NOT NULL,
      name_1_mapping INT DEFAULT 1 NOT NULL,
      name_2_mapping INT DEFAULT 1 NOT NULL,
      active BOOLEAN DEFAULT 1 NOT NULL CHECK (active IN (0,1)),
      FOREIGN KEY (name_1_mapping) REFERENCES STYLE_MAPPING (id),
      FOREIGN KEY (name_2_mapping) REFERENCES STYLE_MAPPING (id)
    )`).run()

    // always starts the applicaton with atleat the default mapping in the mappings table
    const res = db.prepare(`SELECT * FROM style_mapping WHERE name = 'default'`).all()
    if (res.length < 1) {
      db.prepare(`INSERT INTO style_mapping (name) VALUES ('default')`).run()
    }

}

function _instantiateBox(name: string){
  if (!db) return []
  console.log("Loading Box: ", name)
  db.prepare(`
    INSERT INTO style_mapping (name) SELECT ?
    WHERE NOT EXISTS (
      SELECT 1 FROM style_mapping where name = ?
    )
    `).run(name, name)
}

// Safe way of making insertions to avoid sql injection
/* 
db.prepare(`
   INSERT INTO TALLY_DB (name_1, count_1, name_1_mapping) 
   VALUES (?, ?, ?)
 `).run(nameFromReact, 0, mappingId)
*/

// custom functions for table interactions
///////////////////////////////////////////// IPC Functions //////////////////////////////////////////////////////////////////////////
ipcMain.handle('get-tables', async () => {
  if (!db) return []
  return db.prepare(`
    SELECT name 
    FROM sqlite_schema 
    WHERE type='table' 
    ORDER BY name;`
  ).all()
})

ipcMain.handle('run-sql', async (_,sql: string) => {
  if (!db || process.env.NODE_ENV !== 'development') return []
  if (sql.toLowerCase().includes('select')) return db.prepare(`${sql}`).all()
  else if (sql.toLowerCase().includes('insert')) return db.prepare(`${sql}`).run()
  else if (sql.toLowerCase().includes('delete')) return db.prepare(`${sql}`).run()
  else if (sql.toLowerCase().includes('update')) return db.prepare(`${sql}`).run()
  else if (sql.toLowerCase().includes('alter')) return db.prepare(`${sql}`).run()
  return "Failed to run, query didn't contain key argument"
})

ipcMain.handle('is-admin', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Starting Application in Admin Mode")
    return true
  }
  return false
})

ipcMain.handle('get-mappings', async () => {
  if (!db) return []
  return db.prepare(`
    SELECT * FROM STYLE_MAPPING
    `).all()
})

ipcMain.handle('create-tally', async (_, boardInfo: boardInfoType) => {
  if (!db) return []
  console.log("Incoming new Tally Board: ", boardInfo)

  // Get mapping id

  let ids = []

  ids.push(db.prepare(`SELECT id FROM style_mapping where name = ? LIMIT 1`).all(boardInfo.mapping_1)[0])
  ids.push(db.prepare(`SELECT id FROM style_mapping where name = ? LIMIT 1`).all(boardInfo.mapping_2)[0])
  
  console.log(ids)
  
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
    `).run(boardInfo.name_1, boardInfo.name_2, (ids[0] as {"id":string}).id, (ids[1] as {"id":string}).id)
})

ipcMain.handle('get-allBoards', async () => {
  return db.prepare(`SELECT * FROM tally_db where active = 1`).all()
})

ipcMain.handle('get-inactiveBoards', async () => {
  if (!db) return[]
  return db.prepare(`
      SELECT * FROM tally_db WHERE active = 0 
    `).all()
})

ipcMain.handle(`recover-boardById`, async (_, id: number) => {
  if (!db) return []
  return db.prepare(`
    UPDATE tally_db set active = 1 where id = ?
    `).run(id)
})

ipcMain.handle(`permDelete-boardById`, async (_, id: number) => {
  if (!db) return []
  return db.prepare(`
    DELETE FROM tally_db WHERE id = ?
    `).run(id)
})

ipcMain.handle('delete-boardById', async (_, id: number) => {
  if (!db) return []
  console.log("Deleteing Board: ", id)
  return db.prepare(`
    UPDATE tally_db SET active = 0 WHERE id = ?
    `).run(id)
})

ipcMain.handle('get-tally', async (_, id: number) => {
  if (!db) return []
  return db.prepare(`
    SELECT * FROM TALLY_DB where id = ?
    `).all(id)
})

ipcMain.handle('get-mapping-names', async (_, mapping1: number, mapping2: number) => {
  if (!db) return []
  
  let names = []

  names.push(db.prepare(`SELECT name FROM style_mapping where id = ? LIMIT 1`).all(mapping1)[0])
  names.push(db.prepare(`SELECT name FROM style_mapping where id = ? LIMIT 1`).all(mapping2)[0])

  return names
})

// increments count on a tally board based on the count selector flag
ipcMain.handle('increment-count', async (_, id: number, isFirst: boolean) => {
  if (isFirst) return db.prepare(`UPDATE Tally_DB SET count_1 = count_1 + 1 WHERE id = ?`).run(id)
  return db.prepare(`UPDATE Tally_DB SET count_2 = count_2 + 1 WHERE id = ?`).run(id)
})

// decrements count on a tally board based on the count selector flag
ipcMain.handle('subtract-count', async (_, id: number, isFirst: boolean) => {
  if (isFirst) return db.prepare(`UPDATE Tally_DB SET count_1 = count_1 - 1 WHERE id = ?`).run(id)
  return db.prepare(`UPDATE Tally_DB SET count_2 = count_2 - 1 WHERE id = ?`).run(id)
})
/////////////////////////////////////////// Box Loading ///////////////////////////////////////////////////////////////

function boxLoading() {
  _instantiateBox('Red Square')
  _instantiateBox('Purple Square')
  _instantiateBox('Blue-Purple Gradient Square')
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'Tally_Icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    width: 800,
    height: 600,
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(()=>{
  initDatabase()
  boxLoading()
  createWindow()
})
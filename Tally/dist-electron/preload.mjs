"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("dbDAO", {
  getTables: () => electron.ipcRenderer.invoke("get-tables"),
  runSQL: (sql) => electron.ipcRenderer.invoke("run-sql", sql),
  isAdmin: () => electron.ipcRenderer.invoke("is-admin"),
  getTally: () => electron.ipcRenderer.invoke("get-tally"),
  getMappings: () => electron.ipcRenderer.invoke("get-mappings"),
  createTallyBoard: (boardInfo) => electron.ipcRenderer.invoke("create-tally", boardInfo),
  getAllTallyBoard: () => electron.ipcRenderer.invoke("get-allBoards")
});

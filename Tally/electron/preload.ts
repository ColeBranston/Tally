import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

export type boardInfoType = {
  'name_1': string,
  'name_2': string,
  'mapping_1': string,
  'mapping_2': string
}

contextBridge.exposeInMainWorld('dbDAO', {
  getTables: () => ipcRenderer.invoke('get-tables'),
  runSQL: (sql: string) => ipcRenderer.invoke('run-sql', sql),
  isAdmin: () => ipcRenderer.invoke('is-admin'),
  getTally: () => ipcRenderer.invoke('get-tally'),
  getMappings: () => ipcRenderer.invoke('get-mappings'),
  createTallyBoard: (boardInfo: boardInfoType) => ipcRenderer.invoke('create-tally', boardInfo),
  getAllTallyBoard: () => ipcRenderer.invoke('get-allBoards'),
});
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
  getMappings: () => ipcRenderer.invoke('get-mappings'),
  createTallyBoard: (boardInfo: boardInfoType) => ipcRenderer.invoke('create-tally', boardInfo),
  getAllTallyBoard: () => ipcRenderer.invoke('get-allBoards'),
  getTally: (id: number) => ipcRenderer.invoke('get-tally', id),
  getMappingNames: (mapping1: number, mapping2: number) => ipcRenderer.invoke('get-mapping-names', mapping1, mapping2),
  incrementCount: (id: number, isFirst: boolean) => ipcRenderer.invoke("increment-count", id, isFirst),
  subtractCount: (id: number, isFirst: boolean) => ipcRenderer.invoke("subtract-count", id, isFirst),
});
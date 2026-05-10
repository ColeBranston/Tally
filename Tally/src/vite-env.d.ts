/// <reference types="vite/client" />

declare global{
    interface Window{
        dbDAO: IElectronAPI;
    }
}

export interface IElectronAPI {
  getTables: () => Promise<any[]>;
  runSQL: (sql: string) => Promise<any[]>;
  isAdmin: () => Promise<boolean>;
  getTally: () => Promise<any[]>;
}
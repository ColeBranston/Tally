declare global{
    interface Window{
        dbDAO: IElectronAPI
    }
}

export interface IElectronAPI {
  getUsers: () => Promise<any[]>;
}

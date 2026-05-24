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
  getMappings: () => Promise<any[]>
  createTallyBoard: (tallyboard) => Promise<any[]>
  getAllTallyBoard: () => Promise<TallyType[]>
  getTally: (id) => Promise<TallyType[]>;
  getMappingNames: (mappingName1, mappingName2) => Promise<Record<number, Record<string, string>>>;
  incrementCount: (id: number, isFirst: boolean) => Promise<any>;
  subtractCount: (id: number, isFirst: boolean) => Promise<any>;
  deleteBoardByID: (id: number) => Promise<any>;
  permDeleteBoardByID: (id: number) => Promise<any>;
  recoverBoardByID: (id: number) => Promise<any>;
  getAllInactiveTallyBoards: () => Promise<any>
}

export type TallyType = {
    id: number,
    name_1: string,
    count_1: number,
    name_2: string,
    count_2: number,
    name_1_mapping: string, // will create a getter to invoke on the same event that will I can integrate the mappings table
    name_2_mapping: string,
}

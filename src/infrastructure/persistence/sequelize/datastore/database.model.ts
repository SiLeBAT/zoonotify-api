export interface ConnectionInfo {
    host: string;
    dataBase: string;
    dialect: SupportedDB;
    username: string;
    password: string;
    port: number;
}

export type SupportedDB = 'postgres';

export interface DatabaseService<T> {
    createDataStore(connectionInfo: ConnectionInfo): Database<T>;
}

export interface Database<T> {
    isConnectionEstablished(): Promise<boolean>;
    getDatastore(): T;
}

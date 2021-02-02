export interface ConnectionInfo {
    connectionString: string;
}

export type SupportedDB = 'sqlite';

export interface DatabaseService<T> {
    createDataStore(connectionInfo: ConnectionInfo): Database<T>;
}

export interface Database<T> {
    isConnectionEstablished(): Promise<boolean>;
    getDatastore(): T;
}

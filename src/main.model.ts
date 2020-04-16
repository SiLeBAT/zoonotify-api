import { APIDocConfig } from './ui/server/ports';

export interface ServerConfiguration {
    port: number;
    publicAPIDoc: APIDocConfig;
}

export interface DataStoreConfiguration {
    host: string;
    dataBase: string;
    username: string;
    password: string;
    authDatabase: string;
    dataDir: string;
}

export interface GeneralConfiguration {
    logLevel: string;
    supportContact: string;
}

export interface AppConfiguration {
    appName: string;
    apiUrl: string;
}


export interface SystemConfigurationService {
    getServerConfiguration(): ServerConfiguration;
    getApplicationConfiguration(): AppConfiguration;
    getGeneralConfiguration(): GeneralConfiguration;
}

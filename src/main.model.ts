import { ConnectionInfo } from './infrastructure/persistence/sequelize/datastore/database.model';
import { APIDocConfig } from './ui/server/ports';

export type DataStoreConfiguration = ConnectionInfo;

export interface ServerConfiguration {
    port: number;
}

export interface APIConfiguration {
    publicAPIDoc: APIDocConfig;
    apiURL: string;
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
    getAPIConfiguration(): APIConfiguration;
    getServerConfiguration(): ServerConfiguration;
    getApplicationConfiguration(): AppConfiguration;
    getGeneralConfiguration(): GeneralConfiguration;
}

import { APIDocConfig } from './ui/ports';

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

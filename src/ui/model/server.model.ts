export interface APIDocConfig {
    [keys: string]: string[];
}

export interface AppServerConfiguration {
    port: number;
    publicAPIDoc: APIDocConfig;
    logLevel: string;
    supportContact: string;
}

export interface ApplicationConfiguration {
    appName: string;
    apiUrl: string;
    supportContact: string;
}



export interface ConfigurationPort { }

export interface ConfigurationService extends ConfigurationPort {
    getApplicationConfiguration(): ApplicationConfiguration;
}

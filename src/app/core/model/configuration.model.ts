export interface ApplicationConfiguration {
    appName: string;
    apiUrl: string;
    supportContact: string;
}

export interface ConfigurationService {
    getApplicationConfiguration(): ApplicationConfiguration;
}

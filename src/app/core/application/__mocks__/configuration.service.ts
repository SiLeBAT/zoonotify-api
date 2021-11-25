import {
    ConfigurationService,
    ApplicationConfiguration,
} from '../../model/configuration.model';

class MockConfigurationService implements ConfigurationService {
    getApplicationConfiguration(): ApplicationConfiguration {
        return {
            appName: 'Mock',
            supportContact: 'test',
            apiUrl: 'test',
        };
    }
}

const configurationService = new MockConfigurationService();

function getMockConfigurationService(): ConfigurationService {
    return configurationService;
}
export { getMockConfigurationService };

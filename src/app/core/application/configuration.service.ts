// npm
import { injectable, inject } from 'inversify';
import { ApplicationConfiguration } from '../domain/configuration.model';
import { APPLICATION_TYPES } from '../../application.types';

export interface ConfigurationService {
    getApplicationConfiguration(): ApplicationConfiguration;
}

@injectable()
export class DefaultConfigurationService implements ConfigurationService {
    constructor(
        @inject(APPLICATION_TYPES.ApplicationConfiguration)
        private appConfiguration: ApplicationConfiguration
    ) {}

    getApplicationConfiguration(): ApplicationConfiguration {
        return this.appConfiguration;
    }
}

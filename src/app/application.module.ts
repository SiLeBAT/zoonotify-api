import { ContainerModule, interfaces } from 'inversify';
import { ApplicationConfiguration } from './core/domain/configuration.model';
import {
    ConfigurationService,
    DefaultConfigurationService,
} from './core/application/configuration.service';
import { APPLICATION_TYPES } from './application.types';

export function getApplicationContainerModule(
    appConfiguration: ApplicationConfiguration
): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
        bind(APPLICATION_TYPES.ApplicationConfiguration).toConstantValue(
            appConfiguration
        );

        bind<ConfigurationService>(APPLICATION_TYPES.ConfigurationService).to(
            DefaultConfigurationService
        );
    });
}

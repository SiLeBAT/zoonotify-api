import { ContainerModule, interfaces } from 'inversify';
import {
    ConfigurationService,
    ApplicationConfiguration
} from './core/model/configuration.model';
import { DefaultConfigurationService } from './core/application/configuration.service';
import { APPLICATION_TYPES } from './application.types';

export function getApplicationContainerModule(
    appConfiguration: ApplicationConfiguration
): ContainerModule {
    return new ContainerModule(
        (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
            bind(APPLICATION_TYPES.ApplicationConfiguration).toConstantValue(
                appConfiguration
            );

            bind<ConfigurationService>(
                APPLICATION_TYPES.ConfigurationService
            ).to(DefaultConfigurationService);
        }
    );
}

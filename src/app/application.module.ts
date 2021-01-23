import { IsolateService } from './query/model/isolate.model';
import { FilterConfigurationService } from './query/model/filter.model';
import { ContainerModule, interfaces } from 'inversify';
import {
    ConfigurationService,
    ApplicationConfiguration
} from './core/model/configuration.model';
import { DefaultConfigurationService } from './core/application/configuration.service';
import { APPLICATION_TYPES } from './application.types';
import { DefaultFilterConfigurationService } from './query/application/filter-configuration.service';
import { DefaultIsolateService } from './query/application/isolat.service';

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

            bind<FilterConfigurationService>(
                APPLICATION_TYPES.FilterConfigurationService
            ).to(DefaultFilterConfigurationService);

            bind<IsolateService>(APPLICATION_TYPES.IsolateService).to(
                DefaultIsolateService
            );
        }
    );
}

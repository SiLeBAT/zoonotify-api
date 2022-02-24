import { ContainerModule, interfaces } from 'inversify';
import { IsolateService } from './query/model/isolate.model';
import {
    ConfigurationService,
    ApplicationConfiguration,
} from './core/model/configuration.model';
import { DefaultConfigurationService } from './core/application/configuration.service';
import { APPLICATION_TYPES } from './application.types';
import { DefaultIsolateService } from './query/application/isolat.service';
import { DefaultFilterResolutionService } from './query/application/filter-resolution.service';
import {
    FilterResolutionService,
    FilterConfigurationProvider,
} from './query/model/filter.model';
import { GroupService } from './query/model/group.model';
import { DefaultGroupService } from './query/application/group.service';
import { DefaultFilterConfigurationProvider } from './query/application/filter-configuration-provider.service';

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

        bind<FilterResolutionService>(
            APPLICATION_TYPES.FilterResolutionService
        ).to(DefaultFilterResolutionService);

        bind<FilterConfigurationProvider>(
            APPLICATION_TYPES.FilterConfigurationProvider
        ).to(DefaultFilterConfigurationProvider);

        bind<GroupService>(APPLICATION_TYPES.GroupService).to(
            DefaultGroupService
        );

        bind<IsolateService>(APPLICATION_TYPES.IsolateService).to(
            DefaultIsolateService
        );

        bind(APPLICATION_TYPES.GroupingString).toConstantValue('group-by');
    });
}

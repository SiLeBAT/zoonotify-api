import { ContainerModule, interfaces } from 'inversify';
import { IsolateService } from './query/model/isolate.model';
import {
    ConfigurationService,
    ApplicationConfiguration,
} from './core/model/configuration.model';
import { DefaultConfigurationService } from './core/application/configuration.service';
import { APPLICATION_TYPES } from './application.types';
import { DefaultIsolateService } from './query/application/isolat.service';
import { DefaultFilterService } from './query/application/filter.service';
import { FilterService } from './query/model/filter.model';
import { GroupService } from './query/model/group.model';
import { DefaultGroupService } from './query/application/group.service';

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

        bind<FilterService>(APPLICATION_TYPES.FilterService).to(
            DefaultFilterService
        );

        bind<GroupService>(APPLICATION_TYPES.GroupService).to(
            DefaultGroupService
        );

        bind<IsolateService>(APPLICATION_TYPES.IsolateService).to(
            DefaultIsolateService
        );
    });
}

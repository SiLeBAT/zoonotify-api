import {
    IsolateConverter,
    QueryFilterConverter,
} from './model/converter.model';
import { ContainerModule, interfaces } from 'inversify';
import {
    SystemInfoController,
    DatabaseController,
    VersionRootController,
    IsolateController,
} from './model/controller.model';
import SERVER_TYPES from './server.types';
import { DefaultSystemInfoController } from './controllers/info.controller';
import { DefaultDatabaseController } from './controllers/database.controller';
import { DefaultVersionRootController } from './controllers/versionRoot.controller';
import { AppServerConfiguration } from './model/server.model';
import { DefaultIsolateController } from './controllers/isolate.controller';
import { DefaultIsolateConverter } from './converters/isolate.converter';
import { DefaultQueryFilterConverter } from './converters/query-filter.converter';

export function getServerContainerModule(
    serverCongfiguration: AppServerConfiguration
): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
        bind(SERVER_TYPES.AppServerConfiguration).toConstantValue(
            serverCongfiguration
        );

        bind<SystemInfoController>(SERVER_TYPES.InfoController).to(
            DefaultSystemInfoController
        );

        bind<DatabaseController>(SERVER_TYPES.DatabaseController).to(
            DefaultDatabaseController
        );

        bind<VersionRootController>(SERVER_TYPES.VersionRootController).to(
            DefaultVersionRootController
        );

        bind<IsolateController>(SERVER_TYPES.IsolateController).to(
            DefaultIsolateController
        );

        bind<IsolateConverter>(SERVER_TYPES.IsolateConverter)
            .to(DefaultIsolateConverter)
            .inSingletonScope();

        bind(SERVER_TYPES.GroupingString).toConstantValue('group-by');

        bind<QueryFilterConverter>(SERVER_TYPES.QueryFilterConverter).to(
            DefaultQueryFilterConverter
        );
    });
}

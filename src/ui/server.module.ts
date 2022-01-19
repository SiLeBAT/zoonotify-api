import { ContainerModule, interfaces } from 'inversify';
import { DefaultFilterConfigController } from './controllers/filterconfig.controller';
import {
    SystemInfoController,
    DatabaseController,
    VersionRootController,
    FilterConfigController,
    IsolateController,
    ResistanceController,
} from './model/controller.model';
import SERVER_TYPES from './server.types';
import { DefaultSystemInfoController } from './controllers/info.controller';
import { DefaultDatabaseController } from './controllers/database.controller';
import { DefaultVersionRootController } from './controllers/versionRoot.controller';
import { DefaultResistanceController } from './controllers/resistance.controller';
import { AppServerConfiguration } from './model/server.model';
import { DefaultIsolateController } from './controllers/isolate.controller';

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

        bind<ResistanceController>(SERVER_TYPES.ResistanceController).to(
            DefaultResistanceController
        );

        bind<VersionRootController>(SERVER_TYPES.VersionRootController).to(
            DefaultVersionRootController
        );

        bind<FilterConfigController>(SERVER_TYPES.FilterConfigController).to(
            DefaultFilterConfigController
        );

        bind<IsolateController>(SERVER_TYPES.IsolateController).to(
            DefaultIsolateController
        );
    });
}

import { DefaultFilterConfigController } from './controllers/filterconfig.controller';
import { ContainerModule, interfaces } from 'inversify';
import {
    SystemInfoController,
    VersionRootController,
    FilterConfigController,
    IsolateController
} from './model/controller.model';
import SERVER_TYPES from './server.types';
import { DefaultSystemInfoController } from './controllers/info.controller';
import { DefaultVersionRootController } from './controllers/versionRoot.controller';
import { AppServerConfiguration } from './model/server.model';
import { DefaultIsolateController } from './controllers/isolate.controller';

export function getServerContainerModule(
    serverCongfiguration: AppServerConfiguration
): ContainerModule {
    return new ContainerModule(
        (bind: interfaces.Bind, unbind: interfaces.Unbind) => {
            bind(SERVER_TYPES.AppServerConfiguration).toConstantValue(
                serverCongfiguration
            );

            bind<SystemInfoController>(SERVER_TYPES.InfoController).to(
                DefaultSystemInfoController
            );

            bind<VersionRootController>(SERVER_TYPES.VersionRootController).to(
                DefaultVersionRootController
            );

            bind<FilterConfigController>(
                SERVER_TYPES.FilterConfigController
            ).to(DefaultFilterConfigController);

            bind<IsolateController>(SERVER_TYPES.IsolateController).to(
                DefaultIsolateController
            );
        }
    );
}

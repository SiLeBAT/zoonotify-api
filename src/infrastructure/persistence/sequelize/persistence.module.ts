import { ContainerModule, interfaces } from 'inversify';
import { DAOHash } from './service/dao-provider.service';
import { SequelizeIsolateViewGateway } from './gateway/isolate-view.gateway';
import { APPLICATION_TYPES } from '../../../app/ports';
import { PERSISTENCE_TYPES } from './persistence.types';
import { SequelizeFilterConverter } from './service/filter-converter.service';

export function getPersistenceContainerModule(
    daoHash: DAOHash
): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
        bind(PERSISTENCE_TYPES.IsolateViewModel).toConstantValue(
            daoHash.isolateView
        );

        bind(APPLICATION_TYPES.IsolateViewGateway).to(
            SequelizeIsolateViewGateway
        );

        bind(PERSISTENCE_TYPES.FilterConverterService).to(
            SequelizeFilterConverter
        );
    });
}

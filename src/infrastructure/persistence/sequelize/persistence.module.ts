import { ContainerModule, interfaces } from 'inversify';
import { DAOHash } from './service/dao-provider.service';
import { SequelizeIsolateViewGateway } from './gateway/isolate-view.gateway';
import { APPLICATION_TYPES } from '../../../app/ports';
import { PERSISTENCE_TYPES } from './persistence.types';
import { SequelizeFilterConverter } from './service/filter-converter.service';
import { SequelizeResistanceViewGateway } from './gateway/resistance-view.gateway';

export function getPersistenceContainerModule(
    daoHash: DAOHash
): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
        bind(PERSISTENCE_TYPES.IsolateViewModel).toConstantValue(
            daoHash.isolateView
        );
        bind(PERSISTENCE_TYPES.ResistanceViewModel).toConstantValue(
            daoHash.resistanceView
        );

        bind(APPLICATION_TYPES.IsolateViewGateway).to(
            SequelizeIsolateViewGateway
        );

        bind(PERSISTENCE_TYPES.FilterConverterService).to(
            SequelizeFilterConverter
        );

        bind(APPLICATION_TYPES.ResistanceViewGateway).to(
            SequelizeResistanceViewGateway
        );
    });
}

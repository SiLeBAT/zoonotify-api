import { DAOHash } from './dao/dao-provider.service';
import { SequelizeMatrixGateway } from './gateway/matrix.gateway';
import { SequelizeMicroorganismGateway } from './gateway/microorganism.gateway';
import { SequelizeSamplingContextGateway } from './gateway/sampling-context.gateway';
import { SequelizeIsolateGateway } from './gateway/isolate.gateway';
import { ContainerModule, interfaces } from 'inversify';
import { APPLICATION_TYPES } from '../../app/ports';
import { PERSISTENCE_TYPES } from './persistence.types';

export function getPersistenceContainerModule(
    daoHash: DAOHash
): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
        bind(PERSISTENCE_TYPES.MicroorganismModel).toConstantValue(
            daoHash['microorganism']
        );

        bind(PERSISTENCE_TYPES.MatrixModel).toConstantValue(daoHash['matrix']);

        bind(PERSISTENCE_TYPES.SamplingContextModel).toConstantValue(
            daoHash['samplingContext']
        );

        bind(PERSISTENCE_TYPES.IsolateModel).toConstantValue(
            daoHash['isolate']
        );

        bind(APPLICATION_TYPES.IsolateGateway).to(SequelizeIsolateGateway);

        bind(APPLICATION_TYPES.MicroorganismGateway).to(
            SequelizeMicroorganismGateway
        );

        bind(APPLICATION_TYPES.SamplingReasonGateway).to(
            SequelizeSamplingContextGateway
        );

        bind(APPLICATION_TYPES.MatrixGateway).to(SequelizeMatrixGateway);
    });
}

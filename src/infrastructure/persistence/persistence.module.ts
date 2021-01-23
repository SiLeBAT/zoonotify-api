import { DAOHash } from './dao/dao-provider.service';
import { MatrixGateway } from './gateway/matrix.gateway';
import { MicroorganismGateway } from './gateway/microorganism.gateway';
import { SamplingContextGateway } from './gateway/sampling-context.gateway';
import { IsolateGateway } from './gateway/isolate.gateway';
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

        bind(APPLICATION_TYPES.IsolateGateway).to(IsolateGateway);

        bind(APPLICATION_TYPES.MicroorganismGateway).to(MicroorganismGateway);

        bind(APPLICATION_TYPES.SamplingReasonGateway).to(
            SamplingContextGateway
        );

        bind(APPLICATION_TYPES.MatrixGateway).to(MatrixGateway);
    });
}

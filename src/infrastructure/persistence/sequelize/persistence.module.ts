import { SequelizeResistanceGateway } from './gateway/resistance.gateway';
import { SequelizeProductionTypeGateway } from './gateway/production-type.gateway';
import { DAOHash } from './service/dao-provider.service';
import { SequelizeMatrixGateway } from './gateway/matrix.gateway';
import { SequelizeMicroorganismGateway } from './gateway/microorganism.gateway';
import { SequelizeSamplingContextGateway } from './gateway/sampling-context.gateway';
import { SequelizeIsolateViewGateway } from './gateway/isolate-view.gateway';
import { ContainerModule, interfaces } from 'inversify';
import { APPLICATION_TYPES } from '../../../app/ports';
import { PERSISTENCE_TYPES } from './persistence.types';
import { SequelizeFilterConverter } from './service/filter-converter.service';
import { SequelizeFederalStateGateway } from './gateway/federal-state.gateway';
import { SequelizeOriginGateway } from './gateway/origin.gateway';
import { SequelizeSamplingStageGateway } from './gateway/sampling-stage.gateway';
import { SequelizeCategoryGateway } from './gateway/category.gateway';
import { SequelizeIsolateGateway } from './gateway/isolate.gateway';

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

        bind(PERSISTENCE_TYPES.SamplingStageModel).toConstantValue(
            daoHash['samplingStage']
        );

        bind(PERSISTENCE_TYPES.IsolateModel).toConstantValue(
            daoHash['isolate']
        );

        bind(PERSISTENCE_TYPES.FederalStateModel).toConstantValue(
            daoHash['federalState']
        );

        bind(PERSISTENCE_TYPES.OriginModel).toConstantValue(daoHash['origin']);

        bind(PERSISTENCE_TYPES.CategoryModel).toConstantValue(
            daoHash['category']
        );

        bind(PERSISTENCE_TYPES.ProductionTypeModel).toConstantValue(
            daoHash['productionType']
        );
        bind(PERSISTENCE_TYPES.ResistanceModel).toConstantValue(
            daoHash['resistance']
        );

        bind(APPLICATION_TYPES.IsolateViewGateway).to(SequelizeIsolateViewGateway);

        bind(APPLICATION_TYPES.IsolateGateway).to(SequelizeIsolateGateway);

        bind(APPLICATION_TYPES.FederalStateGateway).to(
            SequelizeFederalStateGateway
        );

        bind(APPLICATION_TYPES.CategoryGateway).to(SequelizeCategoryGateway);

        bind(APPLICATION_TYPES.MicroorganismGateway).to(
            SequelizeMicroorganismGateway
        );

        bind(APPLICATION_TYPES.SamplingContextGateway).to(
            SequelizeSamplingContextGateway
        );

        bind(APPLICATION_TYPES.SamplingStageGateway).to(
            SequelizeSamplingStageGateway
        );

        bind(APPLICATION_TYPES.MatrixGateway).to(SequelizeMatrixGateway);

        bind(APPLICATION_TYPES.OriginGateway).to(SequelizeOriginGateway);
        bind(APPLICATION_TYPES.ResistanceGateway).to(
            SequelizeResistanceGateway
        );

        bind(APPLICATION_TYPES.ProductionTypeGateway).to(
            SequelizeProductionTypeGateway
        );

        bind(PERSISTENCE_TYPES.FilterConverterService).to(
            SequelizeFilterConverter
        );
    });
}

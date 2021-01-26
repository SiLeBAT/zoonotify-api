import { IsolateCharacteristicModel } from './../dao/isolate-characteristic.model';
import { IsolateModel } from '../dao/isolate.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import {
    Isolate,
    FederalState,
    IsolateGateway,
    IsolateCollection,
    IsolateCharacteristics,
    IsolateResistance,
    IsolateCount
} from '../../../app/ports';
import { inject, injectable } from 'inversify';
import { IsolateResistanceModel } from '../dao/isolate-resistance.model';

@injectable()
export class SequelizeIsolateGateway implements IsolateGateway {
    static toEntity(isolateModel: IsolateModel): Isolate {
        const characteristics: IsolateCharacteristics = SequelizeIsolateGateway.getCharateristics(
            isolateModel.toIsolateCharacteristics
        );

        const resistances: IsolateResistance = SequelizeIsolateGateway.getResistances(
            isolateModel.toIsolateResistances
        );
        return {
            microorganism: isolateModel.toMicroorganism.name,
            id: isolateModel.id,
            federalState: isolateModel.toFederalState.name as FederalState,
            samplingYear: isolateModel.toProgram.samplingYear,
            samplingContext: isolateModel.toProgram.toSamplingContext.name,
            samplingStage: isolateModel.toProgram.toSamplingStage.name,
            origin:
                isolateModel.toProgram.toCompleteMatrix.toMatrix.toOrigin.name,
            category: isolateModel.toProgram.toProductionType.toCategory.name,
            productionType: isolateModel.toProgram.toProductionType.name,
            matrix: isolateModel.toProgram.toCompleteMatrix.toMatrix.name,
            matrixDetail:
                isolateModel.toProgram.toCompleteMatrix.toMatrixDetail.name,
            characteristics: characteristics,
            resistance: resistances
        };
    }

    private static getCharateristics(
        models: IsolateCharacteristicModel[]
    ): IsolateCharacteristics {
        const characteristics: IsolateCharacteristics = {};
        models.forEach(m => {
            const k = m.toCharacteristic.name as keyof IsolateCharacteristics;
            characteristics[k] = m.value;
        });
        return characteristics;
    }

    private static getResistances(
        models: IsolateResistanceModel[]
    ): IsolateResistance {
        const characteristics: IsolateResistance = {};
        models.forEach(m => {
            const k = m.toResistance.name.toLowerCase();
            characteristics[k] = {
                value: m.value,
                active: m.active
            };
        });
        return characteristics;
    }

    constructor(
        @inject(PERSISTENCE_TYPES.IsolateModel)
        private Isolate: ModelStatic<IsolateModel>
    ) {}

    findAll(): Promise<IsolateCollection> {
        return this.Isolate.findAll({
            include: [{ all: true, nested: true, required: true }]
        }).then(models =>
            models.map(isolateModel => {
                const entity = SequelizeIsolateGateway.toEntity(isolateModel);
                return entity;
            })
        );
    }

    async getCount(): Promise<IsolateCount> {
        return this.Isolate.count({
            distinct: true
        });
    }
}

import { IsolateCharacteristicModel } from './../dao/isolate-characteristic.model';
import {
    IsolateCharacteristics,
    IsolateResistance
} from './../../../app/query/model/isolate.model';
import { IsolateModel } from '../dao/isolate.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { EntityGateway, Isolate, FederalState } from '../../../app/ports';
import { inject, injectable } from 'inversify';
import { IsolateResistanceModel } from '../dao/isolate-resistance.model';

@injectable()
export class IsolateGateway implements EntityGateway<Isolate> {
    constructor(
        @inject(PERSISTENCE_TYPES.IsolateModel)
        private Isolate: ModelStatic<IsolateModel>
    ) {}

    findAll(): Promise<Isolate[]> {
        return this.Isolate.findAll({
            include: [{ all: true, nested: true, required: true }]
        }).then(models =>
            models.map(isolateModel => {
                const entity = IsolateGateway.toEntity(isolateModel);
                return entity;
            })
        );
    }

    static toEntity(isolateModel: IsolateModel): Isolate {
        const characteristics: IsolateCharacteristics = IsolateGateway.getCharateristics(
            isolateModel.isolateCharacteristics
        );

        const resistances: IsolateResistance = IsolateGateway.getResistances(
            isolateModel.isolateResistances
        );
        return {
            microorganism: isolateModel.microorganism.name,
            id: isolateModel.id,
            federalState: isolateModel.federalState.name as FederalState,
            samplingYear: isolateModel.program.samplingYear,
            samplingContext: isolateModel.program.samplingContext.name,
            samplingStage: isolateModel.program.samplingStage.name,
            origin: isolateModel.program.completeMatrix.toMatrix.origin.name,
            category: isolateModel.program.productionType.category.name,
            productionType: isolateModel.program.productionType.name,
            matrix: isolateModel.program.completeMatrix.toMatrix.name,
            matrixDetail: isolateModel.program.completeMatrix.matrixDetail.name,
            characteristics: characteristics,
            resistance: resistances
        };
    }

    private static getCharateristics(
        models: IsolateCharacteristicModel[]
    ): IsolateCharacteristics {
        const characteristics: IsolateCharacteristics = {};
        models.forEach(m => {
            const k = m.characteristic.name as keyof IsolateCharacteristics;
            characteristics[k] = m.value;
        });
        return characteristics;
    }

    private static getResistances(
        models: IsolateResistanceModel[]
    ): IsolateResistance {
        const characteristics: IsolateResistance = {};
        models.forEach(m => {
            const k = m.resistance.name.toLowerCase();
            characteristics[k] = {
                value: m.value,
                active: m.active
            };
        });
        return characteristics;
    }
}

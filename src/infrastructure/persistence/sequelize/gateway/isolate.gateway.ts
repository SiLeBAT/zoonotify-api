import { IsolateModel } from '../dao/isolate.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import {
    Isolate,
    FederalState,
    IsolateGateway
} from '../../../../app/ports';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';

@injectable()
export class SequelizeIsolateGateway implements IsolateGateway {
    static toEntity(isolateModel: IsolateModel): Isolate {



        return {
            microorganism: isolateModel.microorganism,
            id: isolateModel.isolateId,
            federalState: isolateModel.federalState as FederalState,
            samplingYear: isolateModel.samplingYear,
            samplingContext: isolateModel.samplingContext,
            matrixRichtung: isolateModel.matrixRichtung,
            isolateCharacteristics: isolateModel.isolatCharacteristic,
            isolateResistance: isolateModel.isolatResistance
        };
    }

    constructor(
        @inject(PERSISTENCE_TYPES.IsolateModel)
        private Isolate: ModelStatic<IsolateModel>
    ) {}

    findAll(): Promise<Isolate[]> {
        return this.Isolate.findAll().then(model =>
            model.map(m => SequelizeIsolateGateway.toEntity(m))
        );
    }

}

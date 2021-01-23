import { inject, injectable } from 'inversify';
import { MicroorganismModel } from '../dao/microorganism.model';

import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { Microorganism, EntityGateway } from '../../../app/ports';

@injectable()
export class MicroorganismGateway implements EntityGateway<Microorganism> {
    constructor(
        @inject(PERSISTENCE_TYPES.MicroorganismModel)
        private Microorganism: ModelStatic<MicroorganismModel>
    ) {}

    findAll(): Promise<Microorganism[]> {
        return this.Microorganism.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: MicroorganismModel): Microorganism {
        return {
            name: model.name
        };
    }
}

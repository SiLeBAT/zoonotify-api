import { inject, injectable } from 'inversify';
import { ResistanceModel } from '../dao/resistance.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { Resistance, ResistanceGateway } from '../../../../app/ports';

@injectable()
export class SequelizeResistanceGateway implements ResistanceGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.ResistanceModel)
        private Resistance: ModelStatic<ResistanceModel>
    ) {}

    findAll(): Promise<Resistance[]> {
        return this.Resistance.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: ResistanceModel): Resistance {
        return {
            name: model.name
        };
    }
}

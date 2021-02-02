import { inject, injectable } from 'inversify';
import { OriginModel } from '../dao/origin.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { Origin, OriginGateway } from '../../../../app/ports';

@injectable()
export class SequelizeOriginGateway implements OriginGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.OriginModel)
        private Origin: ModelStatic<OriginModel>
    ) {}

    findAll(): Promise<Origin[]> {
        return this.Origin.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: OriginModel): Origin {
        return {
            name: model.name
        };
    }
}

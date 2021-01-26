import { inject, injectable } from 'inversify';
import { SamplingContextModel } from '../dao/sampling-context.model';

import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { SamplingContext, SamplingContextGateway } from '../../../app/ports';

@injectable()
export class SequelizeSamplingContextGateway implements SamplingContextGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.SamplingContextModel)
        private SamplingContext: ModelStatic<SamplingContextModel>
    ) {}

    findAll(): Promise<SamplingContext[]> {
        return this.SamplingContext.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: SamplingContextModel): SamplingContext {
        return {
            name: model.name
        };
    }
}

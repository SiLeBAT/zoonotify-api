import { inject, injectable } from 'inversify';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { SamplingStage, SamplingStageGateway } from '../../../../app/ports';
import { SamplingStageModel } from '../dao/sampling-stage.model';

@injectable()
export class SequelizeSamplingStageGateway implements SamplingStageGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.SamplingStageModel)
        private SamplingStage: ModelStatic<SamplingStageModel>
    ) {}

    findAll(): Promise<SamplingStage[]> {
        return this.SamplingStage.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: SamplingStageModel): SamplingStage {
        return {
            name: model.name
        };
    }
}

import { inject, injectable } from 'inversify';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { FederalState, FederalStateGateway } from '../../../../app/ports';
import { FederalStateModel } from '../dao/federal-state.model';
import { Op } from 'sequelize';

@injectable()
export class SequelizeFederalStateGateway implements FederalStateGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.FederalStateModel)
        private FederalState: ModelStatic<FederalStateModel>
    ) {}

    getPKsForNames(names: string[]): Promise<number[]> {
        return this.FederalState.findAll({
            where: {
                name: {
                    [Op.or]: names
                }
            }
        }).then(models => models.map(m => m.id));
    }

    findAll(): Promise<FederalState[]> {
        return this.FederalState.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: FederalStateModel): FederalState {
        return model.name as FederalState;
    }
}

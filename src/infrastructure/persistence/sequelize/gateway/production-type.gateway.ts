import { inject, injectable } from 'inversify';
import { ProductionTypeModel } from '../dao/production-type.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { ProductionType, ProductionTypeGateway } from '../../../../app/ports';

@injectable()
export class SequelizeProductionTypeGateway implements ProductionTypeGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.ProductionTypeModel)
        private ProductionType: ModelStatic<ProductionTypeModel>
    ) {}

    findAll(): Promise<ProductionType[]> {
        return this.ProductionType.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: ProductionTypeModel): ProductionType {
        return {
            name: model.name
        };
    }
}

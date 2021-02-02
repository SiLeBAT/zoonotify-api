import { inject, injectable } from 'inversify';
import { CategoryModel } from '../dao/category.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { Category, CategoryGateway } from '../../../../app/ports';

@injectable()
export class SequelizeCategoryGateway implements CategoryGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.CategoryModel)
        private Category: ModelStatic<CategoryModel>
    ) {}

    findAll(): Promise<Category[]> {
        return this.Category.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: CategoryModel): Category {
        return {
            name: model.name
        };
    }
}

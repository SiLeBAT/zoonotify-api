import { EntityGateway } from './shared.model';

export interface Category {
    name: string;
}

export interface CategoryGateway extends EntityGateway<Category> {}

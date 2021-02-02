import { EntityGateway } from './shared.model';

export interface ProductionType {
    name: string;
}

export interface ProductionTypeGateway extends EntityGateway<ProductionType> {}

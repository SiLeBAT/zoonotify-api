import { EntityGateway } from './shared.model';

export interface Matrix {
    name: string;
}

export interface MatrixGateway extends EntityGateway<Matrix> {}

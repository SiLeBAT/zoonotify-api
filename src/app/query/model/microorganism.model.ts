import { EntityGateway } from './shared.model';

export interface Microorganism {
    name: string;
}

export interface MicroorganismGateway extends EntityGateway<Microorganism> {}

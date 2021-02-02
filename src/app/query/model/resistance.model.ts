import { EntityGateway } from './shared.model';

export interface Resistance {
    name: string;
}

export interface ResistanceGateway extends EntityGateway<Resistance> {}

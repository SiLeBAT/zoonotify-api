import { EntityGateway } from './shared.model';

export interface Origin {
    name: string;
}

export interface OriginGateway extends EntityGateway<Origin> {}

import { EntityGateway } from './shared.model';

export interface SamplingContext {
    name: string;
}

export interface SamplingContextGateway
    extends EntityGateway<SamplingContext> {}

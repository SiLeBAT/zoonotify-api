import { EntityGateway } from './shared.model';

export interface SamplingStage {
    name: string;
}

export interface SamplingStageGateway extends EntityGateway<SamplingStage> {}

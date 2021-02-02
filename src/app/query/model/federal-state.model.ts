import { FederalState } from './../domain/federal-state.entity';
import { EntityGateway } from './shared.model';

export interface FederalStateGateway extends EntityGateway<FederalState> {
    getPKsForNames(names: string[]): Promise<number[]>;
}

import { EntityGateway } from './shared.model';

export interface Program {
    samplingYear: string;
}

export interface ProgramGateway extends EntityGateway<Program> {}

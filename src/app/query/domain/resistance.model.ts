import { EntityGateway } from './shared.model';

export interface IResistance {
    isolateId: number;
    bfrId: string;
    name: string;
    resistanceValue: number;
    active?: boolean;
}
export class Resistance implements IResistance {
    constructor(
        public isolateId: number,
        public bfrId: string,
        public name: string,
        public resistanceValue: number,
        public active?: boolean
    ) {}
}
export type ResistanceCollection = {
    resistances: Resistance[];
};
export type ResistanceViewGateway = EntityGateway<Resistance[]>;

import { Resistance } from './../../../app/query/domain/resistance.model';
import { ResistanceViewGateway } from '../../../app/ports';
import * as _ from 'lodash';

export function getMockResistanceViewGateway(): ResistanceViewGateway {
    return {
        findAll: jest.fn((dataRequestCreated) => {
            const resistanceArray: Resistance[] = [];
            return Promise.resolve(resistanceArray);
        }),
        find: jest.fn((_filter) => {
            const resistanceArray: Resistance[] = [];
            return Promise.resolve(resistanceArray);
        }),
    };
}

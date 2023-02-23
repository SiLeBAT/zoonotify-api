import { ResistanceViewGateway } from '../../../app/ports';
import { ResistanceViewModel } from '../sequelize/dao/resistance-view.model';
import * as _ from 'lodash';

export function getMockResistanceViewGateway(): ResistanceViewGateway {
    const mvResistenceList: any[] = [
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'GEN',
            resistanceValue: 0.5,
            active: true,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'KAN',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'STR',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'CHL',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'CIP',
            resistanceValue: 0.015,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'TMP',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'SMX',
            resistanceValue: 16,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'TET',
            resistanceValue: 2,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'FOT',
            resistanceValue: 0.625,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'TAZ',
            resistanceValue: 0.25,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'NAL',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'AMP',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 1,
            bfrId: '00000000-0000-0000-0000-000000000000',
            name: 'COL',
            resistanceValue: 2,
            active: false,
        },

        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'GEN',
            resistanceValue: 0.25,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'KAN',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'STR',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'CHL',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'CIP',
            resistanceValue: 0.015,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'TMP',
            resistanceValue: 1,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'SMX',
            resistanceValue: 16,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'TET',
            resistanceValue: 2,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'FOT',
            resistanceValue: 0.625,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'TAZ',
            resistanceValue: 0.25,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'NAL',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'AMP',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 2,
            bfrId: '7cea7890-dd95-4356-848d-5201950984e6',
            name: 'COL',
            resistanceValue: 2,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'GEN',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'KAN',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'STR',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'CHL',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'CIP',
            resistanceValue: 0.015,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'TMP',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'SMX',
            resistanceValue: 16,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'TET',
            resistanceValue: 1,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'FOT',
            resistanceValue: 0.625,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'TAZ',
            resistanceValue: 0.25,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'NAL',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'AMP',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 3,
            bfrId: 'b97447f8-62d5-4894-878c-c90b1ff5c0ac',
            name: 'COL',
            resistanceValue: 2,
            active: false,
        },

        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'GEN',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'KAN',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'STR',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'CHL',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'CIP',
            resistanceValue: 0.015,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'TMP',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'SMX',
            resistanceValue: 16,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'TET',
            resistanceValue: 1,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'FOT',
            resistanceValue: 0.625,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'TAZ',
            resistanceValue: 0.25,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'NAL',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'AMP',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 4,
            bfrId: '5e51ffc1-26f6-43cc-8790-90b861388ed8',
            name: 'COL',
            resistanceValue: 2,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'GEN',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'KAN',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'STR',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'CHL',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'CIP',
            resistanceValue: 0.015,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'TMP',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'SMX',
            resistanceValue: 32,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'TET',
            resistanceValue: 1,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'FOT',
            resistanceValue: 0.125,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'TAZ',
            resistanceValue: 0.25,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'NAL',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'AMP',
            resistanceValue: 4,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'cc7bb307-466c-42d6-a629-9740aebe1467',
            name: 'COL',
            resistanceValue: 2,
            active: false,
        },
        {
            isolateId: 6,
            bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
            name: 'GEN',
            resistanceValue: 0.5,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
            name: 'STR',
            resistanceValue: 32,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
            name: 'CIP',
            resistanceValue: 8,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
            name: 'TET',
            resistanceValue: 16,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
            name: 'ERY',
            resistanceValue: 1,
            active: false,
        },
        {
            isolateId: 5,
            bfrId: 'f719dfa0-6779-48c5-998f-4b8f747910f4',
            name: 'NAL',
            resistanceValue: 1,
            active: false,
        },
    ];
    return {
        find: jest.fn((filter) => {
            let resistanceArray: ResistanceViewModel[] = mvResistenceList;
            return Promise.resolve(resistanceArray);
        }),
    };
}

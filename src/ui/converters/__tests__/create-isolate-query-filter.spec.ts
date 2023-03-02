import 'reflect-metadata';
import { getContainer } from '../../../aspects/container/container';
import { Container } from 'inversify';
import { mockPersistenceContainerModule } from '../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import SERVER_TYPES from '../../server.types';
import { getServerContainerModule } from '../../server.module';
import {
    getApplicationContainerModule,
    IsolateQueryFilter,
} from '../../../app/ports';
import { QueryFilterConverter } from '../../model/converter.model';

describe('Create Query Filter Use Case', () => {
    let service: QueryFilterConverter;
    let container: Container | null;
    beforeEach(() => {
        container = getContainer();
        container.load(
            getApplicationContainerModule({
                appName: 'TestZN',
                apiUrl: '/',
                supportContact: 'none',
            }),
            getServerContainerModule({
                port: 6666,
                publicAPIDoc: {},
                logLevel: 'debug',
                supportContact: 'test',
            }),
            mockPersistenceContainerModule
        );
        service = container.get<QueryFilterConverter>(
            SERVER_TYPES.QueryFilterConverter
        );
    });
    afterEach(() => {
        container = null;
    });
    it('should should return empty filter', () => {
        const filterString: string = '[]';
        const filterArray: any[] = JSON.parse(filterString);
        const result = service.createIsolateQueryFilter(filterArray);
        expect(result).toBeDefined;
        expect(result).toBeInstanceOf(IsolateQueryFilter);
        expect(result.hasORCondition).toBe(false);
        expect(result.isolateFilter.length).toBe(0);
        expect(result.resistanceFilter.length).toBe(0);
    });
    it('should return a simple filter', async () => {
        const filterString: string = '[["microorganism", "=", "STEC"]]';
        const filterArray: any[] = JSON.parse(filterString);
        const result = service.createIsolateQueryFilter(filterArray);
        expect(result).toBeDefined;
        expect(result).toBeInstanceOf(IsolateQueryFilter);
        expect(result.hasORCondition).toBe(false);
        expect(result.isolateFilter.length).toBe(1);
        expect(Array.isArray(result.isolateFilter[0][0])).toBeTruthy;
        expect(result.isolateFilter[0][0]).toEqual('microorganism');
        expect(result.isolateFilter[0][1]).toEqual('=');
        expect(result.isolateFilter[0][2]).toEqual('STEC');
    });
    it('should return a isolate filter with AND', async () => {
        const filterString =
            '["AND", ["microorganism", "=", "STEC"],["stx1","=","%2b"]]';
        const filterArray: any[] = JSON.parse(filterString);
        const result = service.createIsolateQueryFilter(filterArray);
        expect(result).toBeInstanceOf(IsolateQueryFilter);
        expect(result.hasORCondition).toBe(false);
        expect(result.isolateFilter.length).toBe(1);
        expect(result.isolateFilter[0].length).toBe(3);
        expect(Array.isArray(result.isolateFilter[0][0])).toBeFalsy;
        expect(result.isolateFilter[0][0]).toEqual('AND');
        expect(Array.isArray(result.isolateFilter[0][1])).toBeTruthy;
        expect(result.isolateFilter[0][1].length).toBe(3);
        expect(Array.isArray(result.isolateFilter[0][2])).toBeTruthy;
        expect(result.isolateFilter[0][2].length).toBe(3);
        expect(result.resistanceFilter.length).toBe(0);
    });
    it('should return a resistance filter', async () => {
        const filterString =
            '["AND",["microorganism","=","STEC"],["resistance.name","=","AMP"],["resistance.active","=","true"]]';
        const filterArray: any[] = JSON.parse(filterString);
        const result = service.createIsolateQueryFilter(filterArray);
        expect(result).toBeInstanceOf(IsolateQueryFilter);
        expect(result.hasORCondition).toBe(false);
        expect(result.isolateFilter.length).toBe(1);
        expect(result.isolateFilter[0].length).toBe(2);
        expect(Array.isArray(result.isolateFilter[0][0])).toBeFalsy;
        expect(result.isolateFilter[0][0]).toEqual('AND');
        expect(result.isolateFilter[0][1].length).toBe(3);
        expect(result.resistanceFilter.length).toBe(1);
        expect(result.resistanceFilter[0].length).toBe(3);
        expect(Array.isArray(result.resistanceFilter[0][0])).toBeFalsy;
        expect(result.resistanceFilter[0][0]).toEqual('AND');
        expect(result.resistanceFilter[0][1].length).toBe(3);
        expect(result.resistanceFilter[0][2].length).toBe(3);
    });
});

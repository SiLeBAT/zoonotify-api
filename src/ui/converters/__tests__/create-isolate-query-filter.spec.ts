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
    it('should fail because the filter is an empty string', () => {
        const filterString: string = '';
        try {
            service.createIsolateQueryFilter(filterString);
            // Fail
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(
                'Validation failed! Cannot create isolate query filter. Filter is empty string.'
            );
        }
    });
    it('should fail because the filter has no conditions provided ', () => {
        const filterString: string = '[]';
        try {
            service.createIsolateQueryFilter(filterString);
            // Fail
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(
                'Validation failed! Cannot create isolate query filter. No conditions found.'
            );
        }
    });
    it('should return a simple filter', async () => {
        const filterString: string = '[["microorganism", "=", "STEC"]]';
        const result = service.createIsolateQueryFilter(filterString);
        expect(result).toBeDefined;
        expect(result).toBeInstanceOf(IsolateQueryFilter);
    });
    it('should return a isolate filter with AND', async () => {
        const filterString =
            '["AND", ["microorganism", "=", "STEC"],["stx1","=","%2b"]]';
        const result = service.createIsolateQueryFilter(filterString);
        expect(result).toBeInstanceOf(IsolateQueryFilter);
    });
    it('should return a resistance filter', async () => {
        const filterString =
            '["AND",["microorganism","=","STEC"],["resistance.name","=","AMP"],["resistance.active","=","true"]]';
        const result = service.createIsolateQueryFilter(filterString);
        expect(result).toBeInstanceOf(IsolateQueryFilter);
    });
});

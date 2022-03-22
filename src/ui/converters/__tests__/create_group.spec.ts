import 'reflect-metadata';
import { Container } from 'inversify';
import { getApplicationContainerModule } from '../../../app/ports';
import { getContainer } from '../../../aspects';
import { mockPersistenceContainerModule } from '../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import {
    QueryParameters,
    QueryParameterToGroupingConverter,
} from '../../model/converter.model';
import { getServerContainerModule } from '../../server.module';
import SERVER_TYPES from '../../server.types';

describe('Create Group Attribute Use Case', () => {
    let service: QueryParameterToGroupingConverter;
    let container: Container | null;
    beforeEach(() => {
        container = getContainer();
        container.load(
            getServerContainerModule({
                port: 6666,
                publicAPIDoc: {},
                logLevel: 'debug',
                supportContact: 'test',
            }),
            getApplicationContainerModule({
                appName: 'TestZN',
                apiUrl: '/',
                supportContact: 'none',
            }),
            mockPersistenceContainerModule
        );
        service = container.get<QueryParameterToGroupingConverter>(
            SERVER_TYPES.QueryParameterToGroupingConverter
        );
    });
    afterEach(() => {
        container = null;
    });

    const exampleQueryParameter: QueryParameters = {
        matrix: ['Blinddarminhalt'],
        matrixDetail: ['Poolprobe'],
    };
    it('should return an array', () => {
        const result = service.getGroupAttribute(exampleQueryParameter);
        expect(result).toBeInstanceOf(Array);
    });
    it('should return no group attribute', async () => {
        const result = await service.getGroupAttribute(exampleQueryParameter);
        expect(result).toStrictEqual([]);
    });
    it('should return a simple group attribute', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['microorganism'],
        };
        const result = await service.getGroupAttribute(enhancedQuery);
        expect(result).toStrictEqual(['microorganism']);
    });
    it('should return a group attribute with numerous values', async () => {
        const queryParameter: QueryParameters = {
            matrix: ['Blinddarminhalt', 'Kot'],
            ['group-by']: ['microorganism', 'matrix'],
        };

        const result = await service.getGroupAttribute(queryParameter);
        expect(result).toStrictEqual(['microorganism', 'matrix']);
    });
});

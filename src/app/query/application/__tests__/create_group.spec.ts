import { QueryParameters } from './../../model/shared.model';
import { GroupService } from './../../model/group.model';
import { getContainer } from '../../../../aspects/container/container';
import { Container } from 'inversify';
import { mockPersistenceContainerModule } from '../../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import { APPLICATION_TYPES } from '../../../application.types';
import { getApplicationContainerModule } from '../../../ports';

describe('Create Group Attribute Use Case', () => {
    let service: GroupService;
    let container: Container | null;
    beforeEach(() => {
        container = getContainer();
        container.load(
            getApplicationContainerModule({
                appName: 'TestZN',
                apiUrl: '/',
                supportContact: 'none',
            }),
            mockPersistenceContainerModule
        );
        service = container.get<GroupService>(APPLICATION_TYPES.GroupService);
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
    it('should return a characteristic group attribute', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['h_group'],
        };
        const result = await service.getGroupAttribute(enhancedQuery);
        expect(result).toStrictEqual(['characteristicValue']);
    });
    it('should return a characteristic group attribute', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['genes'],
        };
        const result = await service.getGroupAttribute(enhancedQuery);
        expect(result).toStrictEqual(['characteristic']);
    });
});

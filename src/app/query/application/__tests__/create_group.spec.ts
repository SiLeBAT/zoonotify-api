import { GroupService } from './../../model/group.model';
import { FilterService } from './../../model/filter.model';
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
    it('should return an array', () => {
        const result = service.getGroupAttribute({
            matrix: 'Blinddarminhalt',
            matrixDetail: 'Poolprobe',
        });
        expect(result).toBeInstanceOf(Array);
    });
    it('should return no group attribute', async () => {
        const result = await service.getGroupAttribute({
            matrix: 'Blinddarminhalt',
            matrixDetail: 'Poolprobe',
        });
        expect(result).toStrictEqual([]);
    });
    it('should return a simple group attribute', async () => {
        const result = await service.getGroupAttribute({
            matrix: 'Blinddarminhalt',
            matrixDetail: 'Poolprobe',
            ['group-by']: 'microorganism',
        });
        expect(result).toStrictEqual(['microorganism']);
    });
    it('should return a group attribute with numerous values', async () => {
        const result = await service.getGroupAttribute({
            matrix: ['Blinddarminhalt', 'Kot'],
            ['group-by']: ['microorganism', 'matrix'],
        });
        expect(result).toStrictEqual(['microorganism', 'matrix']);
    });
});

import { QueryFilter, FilterValue } from '../shared.model';
import { createQueryFilter } from '../query-filter.entity';
import { Tree } from '../../../core/domain/tree';
import { TreeNode } from '../../../core/domain/tree-node';

describe('QueryFilter Value Object', () => {
    let testObject: QueryFilter;
    let testFilter: FilterValue[];
    beforeEach(() => {
        testObject = createQueryFilter();
        testFilter = [
            {
                key: 'resistance',
                value: 'GEN',
            },
            {
                key: 'resistance_active',
                value: 'true',
            },
            {
                key: 'microorganism',
                value: 'STEC',
            },
            {
                key: 'characteristicValue',
                value: '184',
            },
            {
                key: 'characteristic',
                value: 'o_group',
            },
            {
                key: 'microorganism',
                value: 'Campylobacter spp.',
            },
            {
                key: 'characteristic',
                value: 'species',
            },
            {
                key: 'characteristicValue',
                value: 'C. bobby',
            },
            {
                key: 'characteristicValue',
                value: 'C. coli',
            },
            {
                key: 'microorganism',
                value: 'E. coli',
            },
        ];
    });
    it('should be able to add and remove a filter', () => {
        expect(testObject.isEmpty()).toBe(true);
        const id = testObject.addFilter(testFilter[2]);
        expect(testObject.isEmpty()).toBe(false);
        const result = testObject.removeFilter(id);
        expect(result).toBe(true);
        expect(testObject.isEmpty()).toBe(true);
    });
    it('should be able to retrieve the application Filters', () => {
        const pk = testObject.addFilter(testFilter[2]);
        const rk = testObject.addFilter(testFilter[5]);
        testObject.addFilter(testFilter[0], pk);
        const sk = testObject.addFilter(testFilter[4], pk);
        testObject.addFilter(testFilter[3], sk);
        const tk = testObject.addFilter(testFilter[6], rk);
        testObject.addFilter(testFilter[7], tk);
        testObject.addFilter(testFilter[8], tk);
        testObject.addFilter(testFilter[9]);

        const result = testObject.getApplicationFilter();

        expect(result.length).toBe(4);
    });

    it('should be able to retrieve the persistence filters', () => {
        const pk = testObject.addFilter(testFilter[2]);
        const rk = testObject.addFilter(testFilter[5]);
        testObject.addFilter(testFilter[0], pk);
        const sk = testObject.addFilter(testFilter[4], pk);
        testObject.addFilter(testFilter[3], sk);
        const tk = testObject.addFilter(testFilter[6], rk);
        testObject.addFilter(testFilter[7], tk);
        testObject.addFilter(testFilter[8], tk);
        testObject.addFilter(testFilter[9]);

        const result = testObject.getPersistenceFilter();

        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(3);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[2]);
        expect(root.children.length).toBe(0);
    });
});

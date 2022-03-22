import { TreeNode } from './../../../app/core/domain/tree-node';
import { Tree } from './../../../app/core/domain/tree';
import { FilterValue } from './../../../app/query/domain/shared.model';
import 'reflect-metadata';
import {
    QueryParameters,
    QueryParameterToQueryFilterConverter,
} from './../../model/converter.model';
import { getContainer } from '../../../aspects/container/container';
import { Container } from 'inversify';
import { mockPersistenceContainerModule } from '../../../infrastructure/persistence/__mocks__/persistence-mock.module';
import SERVER_TYPES from '../../server.types';
import { getServerContainerModule } from '../../server.module';
import { getApplicationContainerModule } from '../../../app/ports';

describe('Create Query Filter Use Case', () => {
    let service: QueryParameterToQueryFilterConverter;
    let container: Container | null;
    const testFilter: FilterValue[] = [
        {
            key: 'matrix',
            value: 'Blinddarminhalt',
        },
        {
            key: 'matrixDetail',
            value: 'Poolprobe',
        },
        {
            key: 'microorganism',
            value: 'STEC',
        },
        {
            key: 'characteristicValue',
            value: '+',
        },
        {
            key: 'characteristic',
            value: 'stx1',
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
            key: 'characteristicValue',
            value: 'Enterococcus faecalis',
        },
        {
            key: 'microorganism',
            value: 'Enterococcus spp.',
        },
        {
            key: 'matrix',
            value: 'Kot',
        },
        {
            key: 'matrixDetail',
            value: 'Einzeltierprobe',
        },
        {
            key: 'resistance',
            value: 'GEN',
        },
        {
            key: 'resistance',
            value: 'CIP',
        },
        {
            key: 'characteristic',
            value: 'o_group',
        },
        {
            key: 'characteristicValue',
            value: '116',
        },
        {
            key: 'microorganism',
            value: 'CARBA-E. coli',
        },
        {
            key: 'microorganism',
            value: 'ESBL/AmpC-E. coli',
        },
    ];
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
        service = container.get<QueryParameterToQueryFilterConverter>(
            SERVER_TYPES.QueryParameterToQueryFilterConverter
        );
    });
    afterEach(() => {
        container = null;
    });
    const exampleQueryParameter: QueryParameters = {
        matrix: ['Blinddarminhalt'],
    };

    it('should return a promise', () => {
        const result = service.convertParameterToFilter(exampleQueryParameter);
        expect(result).toBeInstanceOf(Promise);
    });
    it('should return a simple filter', async () => {
        const result = await service.convertParameterToFilter(
            exampleQueryParameter
        );
        expect(result.isEmpty()).toBe(false);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[0]);
    });
    it('should not include "group-by" parameter', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['microorganism'],
        };

        const result = await service.convertParameterToFilter(enhancedQuery);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(1);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[0]);
    });
    it('should return a filter with array', async () => {
        const result = await service.convertParameterToFilter({
            matrix: ['Blinddarminhalt', 'Kot'],
        });
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[0]);
    });
    it('should return a manual filter', async () => {
        const queryParameter: QueryParameters = {
            genes: ['stx1'],
            microorganism: ['STEC'],
        };

        const result = await service.convertParameterToFilter(queryParameter);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(1);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[2]);
        const child = root.children[0];
        expect(child.value).toMatchObject(testFilter[4]);
        const grandChild = child.children[0];
        expect(grandChild.value).toMatchObject(testFilter[3]);
    });
    it('should return a dependents filter', async () => {
        const result = await service.convertParameterToFilter({
            entero_spez: ['Enterococcus faecalis'],
            microorganism: ['Enterococcus spp.'],
        });
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(1);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[10]);
        const child = root.children[0];
        expect(child.value).toMatchObject(testFilter[6]);
        const grandChild = child.children[0];
        expect(grandChild.value).toMatchObject(testFilter[9]);
    });
    it('should return a dependents dynamic filter', async () => {
        const result = await service.convertParameterToFilter({
            matrix: ['Blinddarminhalt', 'Kot'],
            matrixDetail__Kot: ['Einzeltierprobe'],
        });

        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[1];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[11]);
        const child = root.children[0];
        expect(child.value).toMatchObject(testFilter[12]);
    });
    it('should return two dependents dynamic filter', async () => {
        const result = await service.convertParameterToFilter({
            matrix: ['Blinddarminhalt', 'Kot'],
            matrixDetail__Kot: ['Einzeltierprobe'],
            matrixDetail__Blinddarminhalt: ['Einzeltierprobe'],
        });
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree2: Tree<FilterValue> = result.getAllFilterTrees()[1];
        const root2: TreeNode<FilterValue> = filterTree2.getRoot();

        expect(root2.value).toMatchObject(testFilter[11]);
        const child2 = root2.children[0];
        expect(child2.value).toMatchObject(testFilter[12]);
        const filterTree1: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root1: TreeNode<FilterValue> = filterTree1.getRoot();

        expect(root1.value).toMatchObject(testFilter[0]);
        const child1 = root1.children[0];
        expect(child1.value).toMatchObject(testFilter[12]);
    });
    it('should return a resistance filter', async () => {
        const result = await service.convertParameterToFilter({
            microorganism: ['Campylobacter spp.'],
            ['resistance__Campylobacter spp.']: ['GEN'],
        });
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(1);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[5]);
        const child1 = root.children[0];
        expect(child1.value).toMatchObject(testFilter[13]);
        // expect(result.getValuesFor('resistance').length).toBe(1);
    });
    it('should return two resistance filter', async () => {
        const result = await service.convertParameterToFilter({
            microorganism: ['Campylobacter spp.'],
            ['resistance__Campylobacter spp.']: ['GEN', 'CIP'],
        });
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(1);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[5]);
        const child1 = root.children[0];
        expect(child1.value).toMatchObject(testFilter[13]);
        const child2 = root.children[1];
        expect(child2.value).toMatchObject(testFilter[14]);
    });
    it('should return a characteristic filter', async () => {
        const result = await service.convertParameterToFilter({
            microorganism: ['STEC'],
            ['o_group']: ['116'],
        });
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(1);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[2]);
        const child1 = root.children[0];
        expect(child1.value).toMatchObject(testFilter[15]);
        const grandchild = child1.children[0];
        expect(grandchild.value).toMatchObject(testFilter[16]);
    });
    it('should include genes characteristics parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['genes'],
        };

        const result = await service.convertParameterToFilter(enhancedQuery);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[2]);
        expect(root.children.length).toBe(4);
    });
    it('should include o_group characteristics parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['o_group'],
        };
        const result = await service.convertParameterToFilter(enhancedQuery);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[2]);
        expect(root.children.length).toBe(1);
    });

    it('should include spez characteristics and Campy microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['campy_spez'],
        };

        const result = await service.convertParameterToFilter(enhancedQuery);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[5]);
        expect(root.children.length).toBe(1);
    });

    it('should include spez characteristics and Entero microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['entero_spez'],
        };

        const result = await service.convertParameterToFilter(enhancedQuery);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[10]);
        expect(root.children.length).toBe(1);
    });

    it('should include ampc_carba_phenotype characteristics and CARBA-E. coli microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['carba_ampc_carba_phenotype'],
        };

        const result = await service.convertParameterToFilter(enhancedQuery);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[17]);
        expect(root.children.length).toBe(1);
    });

    it('should include ampc_carba_phenotype characteristics and ESBL/AmpC-E. coli microorganism parameter because of group-by', async () => {
        const enhancedQuery: QueryParameters = {
            ...exampleQueryParameter,
            ['group-by']: ['esbl_ampc_carba_phenotype'],
        };

        const result = await service.convertParameterToFilter(enhancedQuery);
        expect(result.isEmpty()).toBe(false);
        expect(result.getAllFilterTrees().length).toBe(2);
        const filterTree: Tree<FilterValue> = result.getAllFilterTrees()[0];
        const root: TreeNode<FilterValue> = filterTree.getRoot();

        expect(root.value).toMatchObject(testFilter[18]);
        expect(root.children.length).toBe(1);
    });
});

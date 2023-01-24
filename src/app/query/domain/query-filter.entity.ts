import _ = require('lodash');
import { TreeNode } from '../../core/domain/tree-node';
import { Tree } from '../../core/domain/tree';
import { Isolate, IsolateCharacteristicSet } from './isolate.model';
import { FilterValue, QueryFilter, ApplicationFilter } from './shared.model';

class DefaultQueryFilter implements QueryFilter {
    /*
         Following attributes are filtered at the application level:
             - Resistance
             - characteristics
         */
    private _applicationFilterKeys = [
        'resistance',
        'characteristic',
        'characteristicValue',
        'resistance_active',
    ];
    //MAYBE: Could add fake root & make it one tree
    private _filters: Tree<FilterValue>[] = [];

    getIdOf(filterValue: FilterValue): string | undefined {
        return (
            this.findFilterValueInRoots(filterValue) ||
            this.findFirstIdOf(filterValue)
        );
    }

    isEmpty(): boolean {
        return _.isEmpty(this._filters);
    }

    //MAYBE: Could only allow addition of main filters as Roots
    addFilter(fv: FilterValue, parentId: string | null = null): string {
        if (_.isNull(parentId)) {
            return (
                this.findFilterValueInRoots(fv) || this.createNewFilterTree(fv)
            );
        }
        const tree = this.findFilterTreeForId(parentId);
        if (!_.isUndefined(tree)) {
            return tree.insert(parentId, fv);
        }
        throw new Error('No parent found with id: ' + parentId);
    }

    removeFilter(key: string): boolean {
        let removed = false;
        // First check the roots of every tree
        const removedArray = _.remove(
            this._filters,
            (tree) => tree.getRoot().key === key
        );
        removed = removed || !_.isEmpty(removedArray);
        if (!removed) {
            this._filters.forEach((filterTree) => {
                removed = removed || filterTree.remove(key);
            });
        }
        return removed;
    }

    getApplicationFilter(): ApplicationFilter[] {
        const applicationFilter: ApplicationFilter[] = [];
        this._filters.forEach((tree) => {
            [...tree.postOrderTraversal()].forEach(
                (node: TreeNode<FilterValue>) => {
                    const fv = node.value;
                    switch (fv.key) {
                        case 'resistance':
                            {
                                const parent = node.parent;

                                if (_.isNull(parent)) break;

                                applicationFilter.push(
                                    new ResistanceApplicationFilter(
                                        parent.value.key as keyof Isolate,
                                        parent.value.value,
                                        fv.value as keyof Isolate
                                    )
                                );
                            }
                            break;
                        case 'characteristicValue':
                            {
                                const characteristicFilter = node.parent;
                                if (_.isNull(characteristicFilter)) break;

                                const microorganismFilter =
                                    characteristicFilter.parent;
                                if (_.isNull(microorganismFilter)) break;

                                applicationFilter.push(
                                    new CharacteristicApplicationFilter(
                                        microorganismFilter.value
                                            .key as keyof Isolate,
                                        microorganismFilter.value.value,
                                        characteristicFilter.value
                                            .value as keyof IsolateCharacteristicSet,
                                        fv.value as string
                                    )
                                );
                            }
                            break;
                        default:
                    }
                }
            );
        });
        return applicationFilter;
    }

    getPersistenceFilter(): QueryFilter {
        const newQF = createQueryFilter();
        this._filters.forEach((tree) => {
            let currentParent: string | null = null;
            [...tree.preOrderTraversal()].forEach(
                (node: TreeNode<FilterValue>) => {
                    const fv = node.value;
                    if (!this._applicationFilterKeys.includes(fv.key)) {
                        currentParent = newQF.addFilter(fv, currentParent);
                    }
                }
            );
        });
        return newQF;
    }

    getAllFilterTrees(): Tree<FilterValue>[] {
        return this._filters;
    }

    private findFilterValueInRoots(
        filterValue: FilterValue
    ): string | undefined {
        let returnId;
        this._filters.forEach((filterTree) => {
            const root = filterTree.getRoot().value;
            if (
                root.key === filterValue.key &&
                root.value === filterValue.value
            ) {
                returnId = filterTree.getRoot().key;
            }
        });
        return returnId;
    }

    private createNewFilterTree(root: FilterValue): string {
        const newFilterTree = new Tree(root);
        this._filters.push(newFilterTree);
        return newFilterTree.getRoot().key;
    }

    private findFirstIdOf(filterValue: FilterValue): string | undefined {
        let returnId;
        _.forEach(this._filters, (tree) => {
            _.forEach([...tree.preOrderTraversal()], (node) => {
                const fv = node.value;
                if (
                    fv.key === filterValue.key &&
                    fv.value === filterValue.value
                ) {
                    returnId = node.key;
                }
            });
        });
        return returnId;
    }

    private findFilterTreeForId(id: string): Tree<FilterValue> | undefined {
        let returnTree;

        _.forEach(this._filters, (tree) => {
            const node = tree.find(id);
            if (!_.isUndefined(node)) {
                returnTree = tree;
            }
        });
        return returnTree;
    }
}

export function createQueryFilter(): QueryFilter {
    return new DefaultQueryFilter();
}

abstract class GenericApplicationFilter implements ApplicationFilter {
    protected _triggerKey: keyof Isolate;
    protected _triggerValue: string;

    constructor(triggerKey: keyof Isolate, triggerValue: string) {
        this._triggerKey = triggerKey;
        this._triggerValue = triggerValue;
    }

    doesFilterApply(isolate: Isolate): boolean {
        if (isolate[this._triggerKey] !== this._triggerValue) {
            return false;
        }
        return this.applySpecificFilter(isolate);
    }
    protected abstract applySpecificFilter(isolate: Isolate): boolean;
}

class ResistanceApplicationFilter extends GenericApplicationFilter {
    private _targetKey: keyof Isolate;

    constructor(
        triggerKey: keyof Isolate,
        triggerValue: string,
        targetKey: keyof Isolate
    ) {
        super(triggerKey, triggerValue);
        this._targetKey = targetKey;
    }

    public applySpecificFilter(isolate: Isolate): boolean {
        const profile = isolate.getResistancesProfileFor(this._targetKey);
        return Boolean(profile)
            ? profile?.active === true
                ? true
                : false
            : false;
    }
}

class CharacteristicApplicationFilter extends GenericApplicationFilter {
    private _targetKey: keyof IsolateCharacteristicSet;
    private _targetValue: string;

    constructor(
        triggerKey: keyof Isolate,
        triggerValue: string,
        targetKey: keyof IsolateCharacteristicSet,
        targetValue: string
    ) {
        super(triggerKey, triggerValue);
        this._targetKey = targetKey;
        this._targetValue = targetValue;
    }

    //FIXME: Check for gene
    public applySpecificFilter(isolate: Isolate): boolean {
        let result = false;
        if (
            isolate.characteristics &&
            isolate.characteristics.hasOwnProperty(this._targetKey)
        ) {
            const characteristic = isolate.characteristics[this._targetKey];
            result = Boolean(characteristic)
                ? String(characteristic) === String(this._targetValue)
                    ? true
                    : false
                : false;
        }

        return result;
    }
}

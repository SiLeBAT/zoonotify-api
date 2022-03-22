import { Tree } from './../../core/domain/tree';
import {
    ApplicationFilter,
    QueryFilter,
    GroupAttributes,
} from './shared.model';
import {
    Isolate,
    IsolateCharacteristicSet,
    IsolateCollection,
    IsolateCount,
    IsolateCountGroup,
} from './isolate.model';
import * as _ from 'lodash';
import { createQueryFilter } from './query-filter.entity';
import { v4 as uuidv4 } from 'uuid';

class DefaultIsolateCollection implements IsolateCollection {
    private _filteredIsolates: Isolate[];
    private _id: string;

    constructor(isolates: Isolate[], filter: QueryFilter) {
        this._filteredIsolates = isolates;
        this._filteredIsolates = this.applyApplicationFilter(filter);
        this._id = uuidv4();
    }

    get isolates() {
        return _.cloneDeep(this._filteredIsolates);
    }

    get id() {
        return this._id;
    }

    getIsolateCount(grouping: GroupAttributes): IsolateCount {
        const countingTree: Tree<IsolateCountGroup> =
            new Tree<IsolateCountGroup>({
                count: this._filteredIsolates.length,
            });

        _.forEach(this._filteredIsolates, (isolate: Isolate) => {
            let currentNode = countingTree.getRoot();
            let myGroups = [...grouping];
            let group: string = myGroups.shift();

            while (group) {
                switch (group) {
                    case 'genes':
                        myGroups = [
                            ...myGroups,
                            ...['stx1', 'stx2', 'eae', 'e_hly'].filter((gene) =>
                                isolate.hasGene(gene)
                            ),
                        ];
                        group = myGroups.shift();
                        continue;
                    case 'resistance':
                        const resistances: string[] = [];
                        _.forEach(isolate.getResistances(), (v, k) => {
                            v?.active ? resistances.push(k) : null;
                        });
                        myGroups = [...myGroups, ...resistances];

                        group = myGroups.shift();
                        continue;
                    default: {
                        let result =
                            isolate.getValueFor(group as keyof Isolate) ||
                            isolate.getCharacteristicValue(
                                group as keyof IsolateCharacteristicSet
                            );

                        if (!result) {
                            result = 'Unknown ' + group;
                        }
                        if (isolate.hasGene(group)) {
                            result = '+';
                        }
                        const rProfile =
                            isolate.getResistancesProfileFor(group);
                        if (rProfile) {
                            result = String(rProfile.active);
                        }
                        let found = false;
                        _.forEach(currentNode.children, (chilNode) => {
                            const childValue: IsolateCountGroup =
                                chilNode.value;
                            if (
                                !_.isUndefined(
                                    childValue[group as keyof IsolateCountGroup]
                                ) &&
                                childValue[group as keyof IsolateCountGroup] ===
                                    result
                            ) {
                                (childValue.count as number) += 1;
                                currentNode = chilNode;
                                found = true;
                            }
                        });
                        if (!found) {
                            const newValue = {
                                ...currentNode.value,
                                ...{
                                    [group]: result as string,
                                    count: 1,
                                },
                            };
                            const key = countingTree.insert(
                                currentNode.key,
                                newValue
                            );
                            currentNode = countingTree.find(key)!;
                        }
                    }
                }
                group = myGroups.shift();
            }
        });
        const groups: IsolateCountGroup[] = [];
        const ary = [...countingTree.postOrderTraversal()];
        ary.forEach((node) => {
            if (node.isLeaf && node.parent) {
                const entry = { ...node.value };
                groups.push(entry);
            }
        });
        return {
            totalNumberOfIsolates: this._filteredIsolates.length,
            groups,
        };
    }

    private applyApplicationFilter(filter: QueryFilter) {
        const applicationFilter: ApplicationFilter[] =
            filter.getApplicationFilter();

        applicationFilter.forEach((filter) => {
            this._filteredIsolates = _.filter(
                this._filteredIsolates,
                (isolate) => {
                    return filter.doesFilterApply(isolate);
                }
            );
        });

        return this._filteredIsolates;
    }
}

export function createIsolateCollection(
    isolates: Isolate[],
    filter: QueryFilter = createQueryFilter()
): IsolateCollection {
    return new DefaultIsolateCollection(isolates, filter);
}

import { TreeNode } from './../../../../app/core/domain/tree-node';
import { FilterValue } from './../../../../app/query/domain/shared.model';
import { injectable } from 'inversify';
import * as _ from 'lodash';
import { Op } from 'sequelize';
import { QueryFilter, Tree } from '../../../../app/ports';
import { characteristicMap } from './utils.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MyWhere = any;
export interface FilterConverter {
    convertFilter(filter: QueryFilter): MyWhere;
}

@injectable()
export class SequelizeFilterConverter implements FilterConverter {
    convertFilter(filter: QueryFilter) {
        if (filter.isEmpty()) return {};

        const whereClause: {
            where: MyWhere;
        } = {
            where: {},
        };

        whereClause.where;
        const resultGroups: MyWhere = {};
        filter.getAllFilterTrees().forEach((tree: Tree<FilterValue>) => {
            const root = tree.getRoot();
            if (!_.isArray(resultGroups[root.value.key])) {
                resultGroups[root.value.key] = [];
            }
            const result = this.myRec(root, null);
            resultGroups[root.value.key].push(result);
        });

        const resultArray: MyWhere[] = [];
        _.forEach(resultGroups, (v: MyWhere[]) => {
            if (v.length > 1) {
                resultArray.push({ [Op.or]: v });
            } else {
                resultArray.push(v[0]);
            }
        });

        if (resultArray.length > 1) {
            whereClause.where[Op.and] = resultArray;
        } else {
            whereClause.where = resultArray[0];
        }

        return whereClause;
    }

    private myRec(child: TreeNode<FilterValue>, parent: FilterValue | null) {
        let childResult: MyWhere[] = [];
        if (child.hasChildren) {
            childResult = child.children.map((c) => this.myRec(c, child.value));
            if (child.children.length > 1) {
                return { [Op.or]: childResult };
            } else {
                return childResult[0];
            }
        } else {
            const childFV = child.value;
            const childEntry = {
                [childFV.key]:
                    characteristicMap.get(childFV.value) || childFV.value,
            };

            if (!_.isNull(parent)) {
                childResult.push({
                    [parent.key]:
                        characteristicMap.get(parent.value) || parent.value,
                });
                childResult.push(childEntry);
                return { [Op.and]: childResult };
            }
            return childEntry;
        }
    }
}

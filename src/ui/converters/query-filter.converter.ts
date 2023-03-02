import { injectable } from 'inversify';
import * as _ from 'lodash';
import { QueryFilterConverter } from '../model/converter.model';
import {
    IsolateQueryFilter,
    PrefixInputParam,
    FilterComponentType,
    LogicalOperator,
} from '../../app/ports';
import { FilterCondition } from '../model/filter.model';

@injectable()
export class DefaultQueryFilterConverter implements QueryFilterConverter {
    private RESISTANCE_TABLE_PREFIX = 'resistance.';

    createIsolateQueryFilter(filterArray: any[]): IsolateQueryFilter {
        // Prefix used as differentiator between paramters that
        // correspond to isolates and paramters that correspond to resistances
        const isolateFilterOutput: any = [];
        let resistanceFilterOutput: any = [];
        const prefixInputParam: PrefixInputParam = new PrefixInputParam(
            this.RESISTANCE_TABLE_PREFIX,
            false
        );
        this.prepareFilter(prefixInputParam, filterArray, isolateFilterOutput);
        const resistancePrefixInputParam: PrefixInputParam =
            new PrefixInputParam(this.RESISTANCE_TABLE_PREFIX, true);
        resistanceFilterOutput = this.prepareFilter(
            resistancePrefixInputParam,
            filterArray,
            resistanceFilterOutput
        );

        const hasORCondition = !_.isUndefined(
            filterArray.find(
                (x) => !Array.isArray(x) && _.isString(x) && 'OR' === x
            )
        );
        return new IsolateQueryFilter(
            hasORCondition,
            isolateFilterOutput,
            resistanceFilterOutput
        );
    }

    private prepareFilter(
        prefixInputParam: PrefixInputParam,
        filterList: any[],
        resultListOutput: any[]
    ): any[] {
        const logicalOperatorList: LogicalOperator[] = [];
        let hasLogicalOperator = false;
        let logicalOperatorCount = 0;
        filterList.forEach((item) => {
            const filterComponentType =
                this.getFilterComponentTypeViaFilterListItem(item);
            switch (filterComponentType) {
                case FilterComponentType.LOGICAL_OPERATOR:
                    // carry over the logical operator
                    const tempOperator =
                        LogicalOperator[item as keyof typeof LogicalOperator];
                    if (!_.isUndefined(tempOperator)) {
                        logicalOperatorList.push(tempOperator);
                        logicalOperatorCount++;
                    }
                    break;
                case FilterComponentType.FILTER_CONDITION:
                    const isInclusiveQueryFilter =
                        prefixInputParam.isInclusivePrefix &&
                        item[0].startsWith(prefixInputParam.prefixValue);
                    const isExclusiveQueryFilter =
                        !prefixInputParam.isInclusivePrefix &&
                        !item[0].startsWith(prefixInputParam.prefixValue);

                    if (isExclusiveQueryFilter || isInclusiveQueryFilter) {
                        const removePrefix =
                            isInclusiveQueryFilter && !isExclusiveQueryFilter;
                        hasLogicalOperator = this.addConditionToFilter(
                            item,
                            removePrefix,
                            hasLogicalOperator,
                            logicalOperatorCount,
                            logicalOperatorList,
                            resultListOutput
                        );
                        if (hasLogicalOperator) {
                            logicalOperatorCount--;
                        }
                    }
                    break;
                case FilterComponentType.CHILD_FILTER_LIST:
                    // look for previously collected operator
                    if (
                        1 === logicalOperatorCount &&
                        logicalOperatorList.length > 0
                    ) {
                        resultListOutput.push(logicalOperatorList[0]);
                        // cleanup
                        logicalOperatorList.length = 0;
                        logicalOperatorCount = 0;
                    }
                    // call self
                    this.prepareFilter(
                        prefixInputParam,
                        item,
                        resultListOutput
                    );
                    break;
                case FilterComponentType.COMPARE_OPERATOR:
                    // nothing todo here, but still valid
                    break;
                case FilterComponentType.NOT_SET:
                default:
                    throw Error(
                        'Unexpected enum value detected: ' + filterComponentType
                    );
            }
        });
        resultListOutput = !_.isUndefined(
            resultListOutput.find((item) => Array.isArray(item))
        )
            ? resultListOutput
            : [];
        // TODO: fix behavior that introduces the used opertor again (per Table)
        // the operator should be marked as used and/or removed from the data we process
        if (_.isString(resultListOutput[resultListOutput.length - 1])) {
            // per definition we should not have any logicalOperators in the end of our resultList;
            // as this might happen when we use sub-filters for resistances here is a simple workaround!
            // example filter:
            // [
            //  ["microorganism" , "=" , "STEC"],
            //  ["OR" ,
            //      ["AND",
            //          ["resistance.name", "=", "AMR"],
            //          ["resistance.active","=","true"]],
            //      ["AND",
            //          ["resistance.name","=","AZI"],
            //          ["resistance.active","=","true"],
            //          ["resistance.resistanceValue",">",100]
            //      ]
            //  ]
            // ]
            resultListOutput.pop();
        }
        return resultListOutput;
    }

    private addConditionToFilter(
        item: [string, string, string | (number | string)[]],
        removePrefix: boolean,
        hasLogicalOperator: boolean,
        logicalOperatorCount: number,
        logicalOperatorList: LogicalOperator[],
        resultListOutput: any[]
    ): boolean {
        while (logicalOperatorCount > 0) {
            logicalOperatorCount--;
            const op = logicalOperatorList.splice(logicalOperatorCount, 1);
            if (0 === logicalOperatorCount) {
                if (0 < op.length) {
                    resultListOutput.push(op);
                }
            } else {
                resultListOutput.push(op[0]);
            }
            hasLogicalOperator = true;
        }

        const fieldName: string = removePrefix
            ? item[0].split('.')[1]
            : item[0];
        const compareOperator: string = item[1];
        const searchValue: any = item[2];
        const condition: FilterCondition = [
            fieldName,
            compareOperator,
            searchValue,
        ];
        if (hasLogicalOperator) {
            // if there has any logical operator been processed in the upper loop
            // then the latest item is expected to always contain an array
            resultListOutput[resultListOutput.length - 1].push(condition);
        } else {
            resultListOutput.push(condition);
        }
        return hasLogicalOperator;
    }

    private isLogicOperator(item: string): boolean {
        return null != LogicalOperator[item as keyof typeof LogicalOperator];
    }
    private isCompareOperator(item: string): boolean {
        if (!_.isString(item)) {
            return false;
        }
        const comparatorList = [
            '=',
            'EQ',
            '!=',
            '<>',
            'NEQ',
            '<',
            'LT',
            '<=',
            'LTE',
            '>',
            'GT',
            '>=',
            'GTE',
            'IN',
            'NOT',
            'NOT_IN',
            'LIKE',
        ];
        return comparatorList.includes(item);
    }

    private isInOperator(item: string): boolean {
        return _.isString(item) && ('IN' === item || 'NOT_IN' === item);
    }
    // checks if we have a ..'WHERE ... IN' condition
    private isIncludeCondition(itemList: any[]): boolean {
        let result = itemList.length === 3;
        result =
            _.isString(itemList[0]) &&
            this.isInOperator(itemList[1]) &&
            Array.isArray(itemList[2]);
        return result;
    }
    // checks if the provided item contains an array with a (partial) condition
    private isCondition(item: any) {
        let result = false;
        if (Array.isArray(item)) {
            const consistsOfThree = item.length === 3;
            const hasComparator = this.isCompareOperator(item[1]);
            result = consistsOfThree && hasComparator;
        }
        return result;
    }
    // Retrieve the type of the partial filter item.
    // The type indicates which function the item will have in our Wherepart
    private getFilterComponentTypeViaFilterListItem(
        item: any
    ): FilterComponentType {
        let resultType: FilterComponentType;

        const isLogicOperator = _.isString(item) && this.isLogicOperator(item);
        const isCompareOperator =
            !isLogicOperator &&
            _.isString(item) &&
            this.isCompareOperator(item);
        const isOperator = isLogicOperator || isCompareOperator;
        const isSimpleCondition = !isOperator && this.isCondition(item);

        const isChildFilterList =
            !isSimpleCondition &&
            Array.isArray(item) &&
            item.length >= 2 &&
            item.filter((i) => Array.isArray(i)).length >= 1;

        if (isLogicOperator) {
            resultType = FilterComponentType.LOGICAL_OPERATOR;
        } else if (isCompareOperator) {
            resultType = FilterComponentType.COMPARE_OPERATOR;
        } else if (isSimpleCondition) {
            resultType = FilterComponentType.FILTER_CONDITION;
        } else if (isChildFilterList) {
            resultType = FilterComponentType.CHILD_FILTER_LIST;
        } else {
            resultType = FilterComponentType.NOT_SET;
        }
        return resultType;
    }
}

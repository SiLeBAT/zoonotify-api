import { injectable } from 'inversify';
import * as _ from 'lodash';
import { QueryFilterConverter } from '../model/converter.model';
import { IsolateQueryFilter, PrefixInputParam } from '../../app/ports';

@injectable()
export class DefaultQueryFilterConverter implements QueryFilterConverter {
    private RESISTANCE_TABLE_PREFIX = 'resistance.';

    createIsolateQueryFilter(filterValueString: string): IsolateQueryFilter {
        this.validateCreateIsolateQueryFilter(filterValueString);
        const isolateFilterOutput: any = [];
        const resistanceFilterOutput: any = [];

        // parse provided input into JSON array
        const filterList: any[] =
            this.convertInputFilterToList(filterValueString);

        const prefixInputParam: PrefixInputParam = new PrefixInputParam(
            this.RESISTANCE_TABLE_PREFIX,
            false
        );
        this.prepareFilter(prefixInputParam, filterList, isolateFilterOutput);
        const resistancePrefixInputParam: PrefixInputParam =
            new PrefixInputParam(this.RESISTANCE_TABLE_PREFIX, true);
        this.prepareFilter(
            resistancePrefixInputParam,
            filterList,
            resistanceFilterOutput
        );
        const hasORCondition = !_.isUndefined(
            filterList.find(
                (x) => !Array.isArray(x) && _.isString(x) && 'OR' === x
            )
        );
        return new IsolateQueryFilter(
            hasORCondition,
            isolateFilterOutput,
            resistanceFilterOutput
        );
    }

    validateCreateIsolateQueryFilter(filterValueString: string) {
        const inputToValidate = filterValueString.trim();
        if (_.isEmpty(inputToValidate)) {
            throw Error(
                'Validation failed! Cannot create isolate query filter. Filter is empty string.'
            );
        }
        const filterList: any[] =
            this.convertInputFilterToList(filterValueString);
        if (null == filterList.find((item) => Array.isArray(item))) {
            throw Error(
                'Validation failed! Cannot create isolate query filter. No conditions found.'
            );
        }
    }

    // parses the filter property of request into a JSON array
    convertInputFilterToList(filterValueString: string): string[] {
        const cleaner = (key: string, value: any) =>
            key === '__proto__' ? undefined : value;
        const result: string[] = JSON.parse(filterValueString, cleaner);
        return result;
    }

    private prepareFilter(
        prefixInputParam: PrefixInputParam,
        filterList: any[],
        resultListOutput: any[]
    ): any[] {
        const logicalOperatorList: string[] = [];
        let hasLogicalOperator = false;
        let logicalOperatorCount = 0;
        filterList.forEach((item) => {
            const filterListItemType =
                this.getFilterListItemTypeViaFilterListItem(item);
            switch (filterListItemType) {
                case 'LOGICAL_OPERATOR':
                    logicalOperatorList.push(item);
                    logicalOperatorCount++;
                    break;
                case 'COMPARE_OPERATOR':
                    break;
                case 'SIMPLE_CONDITION':
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
                    }
                    break;
                case 'CHILD_FILTER_LIST':
                    if (1 === logicalOperatorCount) {
                        resultListOutput.push(logicalOperatorList[0]);
                        logicalOperatorList.length = 0;
                        logicalOperatorCount = 0;
                    }
                    this.prepareFilter(
                        prefixInputParam,
                        item,
                        resultListOutput
                    );
                    break;
                case 'NOT_SET':
                default:
                    throw Error(
                        'Unexpected Value detected: ' + filterListItemType
                    );
            }
        });
        resultListOutput = !_.isUndefined(
            resultListOutput.find((item) => Array.isArray(item))
        )
            ? resultListOutput
            : [];
        if (_.isString(resultListOutput[resultListOutput.length - 1])) {
            resultListOutput.pop();
        }
        return resultListOutput;
    }

    private addConditionToFilter(
        item: any[],
        removePrefix: boolean,
        hasLogicalOperator: boolean,
        logicalOperatorCount: number,
        logicalOperatorList: any[],
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
        const condition = [fieldName, compareOperator, searchValue];
        if (hasLogicalOperator) {
            // the last item is always an array
            resultListOutput[resultListOutput.length - 1].push(condition);
        } else {
            resultListOutput.push(condition);
        }
        return hasLogicalOperator;
    }

    private isLogicOperator(item: string): boolean {
        const logicOperatorList = ['OR', 'AND'];
        return logicOperatorList.includes(item);
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
    // Retrieve the type of the partial fiter item.
    // The type indicates which function the item will have in our Wherepart
    private getFilterListItemTypeViaFilterListItem(item: any): string {
        let isFound = false;
        let resultType = 'NOT_SET';

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
            resultType = 'LOGICAL_OPERATOR';
            isFound = true;
        }
        if (isCompareOperator && !isFound) {
            resultType = 'COMPARE_OPERATOR';
            isFound = true;
        }
        if (isSimpleCondition && !isFound) {
            resultType = 'SIMPLE_CONDITION';
            isFound = true;
        }
        if (isChildFilterList && !isFound) {
            resultType = 'CHILD_FILTER_LIST';
            isFound = true;
        }
        return resultType;
    }
}

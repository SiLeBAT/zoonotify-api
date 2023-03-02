import _ = require('lodash');
import { Model, BuildOptions, Op } from 'sequelize';
import { FilterCondition } from 'src/ui/model/filter.model';
import { LogicalOperator } from '../../../../app/ports';

export type ModelStatic<T> = typeof Model & {
    new (values?: object, options?: BuildOptions): T;
};

export function createWherePart(filterArray: any[]) {
    const wherePart: any = {};
    const sequelizeWhereConditions = createSequelizeFilter(filterArray);
    wherePart['where'] = sequelizeWhereConditions;
    return wherePart;
}

function createCondition(
    item: FilterCondition,
    conditionOutput: any = {}
): any {
    const attributeName: string = item[0];
    const comaparator = getCompareOperator(item[1]);
    const attributeValue = item[2];
    if (Op.eq === comaparator) {
        // eq operator is implicit
        conditionOutput[attributeName] = attributeValue;
    } else {
        // set explicit compare operator
        conditionOutput[attributeName] = { [comaparator]: attributeValue };
    }
    return conditionOutput;
}

function createSequelizeFilter(filterArray: any[]): any {
    validateCreateSequilizeFilter(filterArray);
    let result: any = {};
    let sequelizeCondition: typeof Op.or | typeof Op.and;
    let nextSequelizeCondition: typeof Op.or | typeof Op.and;

    // multidimensional array - currently only 3 lvl as maximum
    // todo: implement as recursive method to allow arrays more than three levels deep
    filterArray.forEach((item) => {
        // only true in the first level of the multidimensional array
        const isLogicalOp = !Array.isArray(item) && item in LogicalOperator;

        // only true from the second level of the multidimensional
        const isSimpleMatchCondition =
            Array.isArray(item) &&
            !Array.isArray(item[0]) &&
            _.isUndefined(
                LogicalOperator[item[0] as keyof typeof LogicalOperator]
            ) &&
            _.isString(item[0]) &&
            1 === filterArray.length;

        const isMultiMatchCondition =
            Array.isArray(item) &&
            !Array.isArray(item[0]) &&
            _.isUndefined(
                LogicalOperator[item[0] as keyof typeof LogicalOperator]
            ) &&
            _.isString(item[0]) &&
            1 < filterArray.length;

        // only true if we have a 3rd level in the array
        const isConditionWithLogicalOp =
            Array.isArray(item) &&
            !Array.isArray(item[0]) &&
            item[0] in LogicalOperator;

        // create array for corresponding condition if it does not already not exists
        if (isLogicalOp) {
            sequelizeCondition = getSequelizeCondition(item);
            result[sequelizeCondition] = [];
        }
        // if the list contains only one item, the result is a standalone condition
        if (isSimpleMatchCondition) {
            const condition: any = createCondition(item as FilterCondition);
            result = condition;
        }
        if (isMultiMatchCondition) {
            // create array for corresponding condition, if it does not already not exists
            if (_.isUndefined(result[sequelizeCondition])) {
                // default: set sequelizeCondition to AND
                sequelizeCondition = Op.and;
                result[sequelizeCondition] = [];
            }
            const condition: any = createCondition(item as FilterCondition);
            // add the condition to the corresponding list
            result[sequelizeCondition].push(condition);
        }
        if (isConditionWithLogicalOp) {
            let condition: any;
            const tempConditionArray = item.slice(1);
            tempConditionArray.forEach((c) => {
                condition = createCondition(c as FilterCondition, condition);
            });

            nextSequelizeCondition = getSequelizeCondition(item[0]);
            const useExistingCondition =
                !_.isUndefined(condition) &&
                !_.isUndefined(sequelizeCondition) &&
                !_.isUndefined(nextSequelizeCondition);
            const useNewCondition =
                _.isUndefined(sequelizeCondition) &&
                !_.isUndefined(condition) &&
                !_.isUndefined(nextSequelizeCondition);
            if (useExistingCondition) {
                result[sequelizeCondition].push({
                    [nextSequelizeCondition]: condition,
                });
            }
            if (useNewCondition) {
                result[nextSequelizeCondition] = [condition];
            }
        }
    });
    return result;
}
function validateCreateSequilizeFilter(filterArray: any[]) {
    if (_.isUndefined(filterArray)) {
        throw Error(
            'Unexpected error occured, the provided filterArray is undefined.'
        );
    }
    // make sure all list items are defined
    validateFilterArray(filterArray);
}
function validateFilterArray(filterArray: any[]) {
    filterArray.forEach((item) => {
        if (_.isUndefined(item)) {
            throw Error(
                'Unexpected error occured, the provided item is undefined.'
            );
        }
        if (_.isString(item) && _.isEmpty(item.trim())) {
            throw Error(
                'Unexpected error occured, the provided item is empty.'
            );
        }
        // call self
        if (Array.isArray(item)) {
            validateFilterArray(item);
        }
    });
}

function getCompareOperator(compareOperator: string): symbol {
    let comparator = Op.eq;
    switch (compareOperator) {
        case '=':
        case 'EQ':
            comparator = Op.eq;
            break;
        case '!=':
        case 'NEQ':
            comparator = Op.ne;
            break;
        case 'IN':
            comparator = Op.in;
            break;
        case 'NOT_IN':
            comparator = Op.notIn;
            break;
        case '<':
        case 'LT':
            comparator = Op.lt;
            break;
        case '<=':
        case 'LTE':
            comparator = Op.lte;
            break;
        case '>':
        case 'GT':
            comparator = Op.gt;
            break;
        case '>=':
        case 'GTE':
            comparator = Op.gte;
            break;
        default:
            throw new Error(
                'Unknown comapreOperator detected with value: ' +
                    compareOperator
            );
    }
    return comparator;
}

function getSequelizeCondition(
    conditionValue: LogicalOperator
): typeof Op.or | typeof Op.and {
    let sequilizeCondition: typeof Op.or | typeof Op.and;
    switch (conditionValue) {
        case LogicalOperator.OR:
            sequilizeCondition = Op.or;
            break;
        case LogicalOperator.AND:
            sequilizeCondition = Op.and;
            break;
        default:
            throw new Error(
                'Unexpected parameter value, condition=' + conditionValue
            );
    }
    return sequilizeCondition;
}

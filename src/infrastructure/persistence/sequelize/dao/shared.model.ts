import _ = require('lodash');
import { Model, BuildOptions, Op } from 'sequelize';

export type ModelStatic<T> = typeof Model & {
    new (values?: object, options?: BuildOptions): T;
};

export enum CompareOperator {
    EQ,
    GT,
    GTE,
    LT,
    LTE,
    NEQ,
}

function getSequelizeCondition(
    conditionValue: string,
    sequilizeCondition: any = {}
) {
    switch (conditionValue) {
        case 'OR':
            sequilizeCondition = Op.or;
            break;
        case 'AND':
            sequilizeCondition = Op.and;
            break;
        default:
            throw new Error(
                'Unexpected parameter value, condition=' + conditionValue
            );
    }
    return sequilizeCondition;
}

export function getCompareOperator(compareOperator: string): symbol {
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
        case '>':
        case 'GT':
            comparator = Op.gt;
            break;
        default:
            throw new Error(
                'Unknown comapreOperator detected with value: ' +
                    compareOperator
            );
    }
    return comparator;
}

function createSequelizeFilter(filterArray: any[]): any {
    let result: any = {};
    let sequelizeCondition: any;
    let nextSequelizeCondition: any;
    filterArray.forEach((item, index) => {
        if (!Array.isArray(item)) {
            sequelizeCondition = getSequelizeCondition(item);
            result[sequelizeCondition] = [];
        }
        if (Array.isArray(item)) {
            if (!Array.isArray(item[0])) {
                const condition: any = {};
                const tempConditionArray = item.slice(1);
                if ('OR' === item[0] || 'AND' === item[0]) {
                    nextSequelizeCondition = getSequelizeCondition(item[0]);
                    tempConditionArray.forEach((c) => {
                        const attributeName = c[0];
                        const comaparator = getCompareOperator(c[1]);
                        const attributeValue = c[2];

                        if (Op.eq === comaparator) {
                            condition[attributeName] = attributeValue;
                        } else {
                            condition[attributeName] = {
                                [comaparator]: attributeValue,
                            };
                        }
                    });
                    if (
                        !_.isUndefined(condition) &&
                        !_.isUndefined(sequelizeCondition) &&
                        !_.isUndefined(nextSequelizeCondition)
                    ) {
                        result[sequelizeCondition].push({
                            [nextSequelizeCondition]: condition,
                        });
                    }
                    if (
                        _.isUndefined(sequelizeCondition) &&
                        !_.isUndefined(condition) &&
                        !_.isUndefined(nextSequelizeCondition)
                    ) {
                        result[nextSequelizeCondition] = [condition];
                    }
                } else {
                    if (filterArray.length === 1) {
                        const condition: any = {};
                        let attributeName: string;
                        if (_.isString(item[0])) {
                            attributeName = item[0];
                            const comaparator = getCompareOperator(item[1]);
                            const attributeValue = item[2];
                            if (Op.eq === comaparator) {
                                condition[attributeName] = attributeValue;
                            } else {
                                condition[attributeName] = {
                                    [comaparator]: attributeValue,
                                };
                            }
                            result = condition;
                        }
                    }
                    if (
                        filterArray.length > 1 &&
                        _.isUndefined(result[sequelizeCondition])
                    ) {
                        sequelizeCondition = Op.and;
                        result[sequelizeCondition] = [];
                    }
                    if (
                        filterArray.length > 1 &&
                        Array.isArray(result[sequelizeCondition])
                    ) {
                        const condition: any = {};
                        let attributeName: string;
                        if (_.isString(item[0])) {
                            attributeName = item[0];
                            const comaparator = getCompareOperator(item[1]);
                            const attributeValue = item[2];
                            if (Op.eq === comaparator) {
                                condition[attributeName] = attributeValue;
                            } else {
                                condition[attributeName] = {
                                    [comaparator]: attributeValue,
                                };
                            }
                            result[sequelizeCondition].push(condition);
                        }
                    }
                }
            }
        }
    });
    return result;
}

export function createWherePart(filterArray: any[]) {
    const wherePart: any = {};
    const sequelizeFilter: any = createSequelizeFilter(filterArray);
    wherePart['where'] = sequelizeFilter;
    return wherePart;
}

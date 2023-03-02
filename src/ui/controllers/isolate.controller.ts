import { Response, Request } from 'express';
import {
    controller,
    httpGet,
    request,
    response,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import {
    APPLICATION_TYPES,
    IsolatePort,
    Isolate,
    CompareOperator,
    LogicalOperator,
} from '../../app/ports';
import {
    GetIsolatesSuccessResponse,
    IsolateDTO,
} from '../model/response.model';
import { IsolateController } from '../model/controller.model';
import { AbstractController } from './abstract.controller';
import { ROUTE } from '../model/enums';
import { logger } from '../../aspects';
import SERVER_TYPES from '../server.types';
import {
    QueryFilterConverter,
    IsolateConverter,
} from '../model/converter.model';

import _ = require('lodash');
import { IsolateQueryFilter } from '../../app/query/domain/filter.model';
import {
    IsolateViewAttributes,
    ResistanceViewAttributes,
} from '../../infrastructure/ports';

enum ISOLATE_ROUTE {
    ROOT = '/isolate',
}

@controller(ROUTE.VERSION + ISOLATE_ROUTE.ROOT)
export class DefaultIsolateController
    extends AbstractController
    implements IsolateController
{
    private static REQUEST_PROPERTY_NAME_FILTER = 'filter';

    constructor(
        @inject(APPLICATION_TYPES.IsolateService)
        private isolateService: IsolatePort,
        @inject(SERVER_TYPES.IsolateConverter)
        private isolateConverter: IsolateConverter,
        @inject(SERVER_TYPES.QueryFilterConverter)
        private queryFilterConverter: QueryFilterConverter
    ) {
        super();
    }

    @httpGet('/')
    async getIsolate(@request() req: Request, @response() res: Response) {
        logger.trace(
            `${this.constructor.name}.${this.getIsolate.name}, Received: ${req}`
        );
        try {
            let resultList: Isolate[] = [];
            if (
                Object.prototype.hasOwnProperty.call(
                    req.query,
                    DefaultIsolateController.REQUEST_PROPERTY_NAME_FILTER
                )
            ) {
                const filterValueString = req.query[
                    DefaultIsolateController.REQUEST_PROPERTY_NAME_FILTER
                ] as string;

                const filterListOutput: any[] = [];
                this.validateCreateIsolateQueryFilter(
                    filterValueString,
                    filterListOutput
                );

                const filter: IsolateQueryFilter =
                    this.queryFilterConverter.createIsolateQueryFilter(
                        filterListOutput
                    );
                resultList =
                    await this.isolateService.getIsolateListByIsolateQueryFilter(
                        filter
                    );
            }

            const dto: GetIsolatesSuccessResponse = {
                isolates: ([] = resultList.map((isolate) =>
                    this.isolateConverter.createIsolateDTOViaIsolate(isolate)
                )),
            };
            this.ok(res, dto);
        } catch (error) {
            logger.error('Unable to send response: ', error);
            this.handleError(res);
        }
    }

    validateCreateIsolateQueryFilter(
        filterValueString: string,
        filterArrayOutput: any[]
    ) {
        const inputToValidate = filterValueString.trim();
        if (_.isEmpty(inputToValidate)) {
            throw Error(
                'Validation failed! Cannot create isolate query filter. Filter is empty string.'
            );
        }

        // parse provided input into JSON array
        const cleaner = (key: string, value: any) =>
            key === '__proto__' ? undefined : value;
        const tempFilterArray: any[] = JSON.parse(filterValueString, cleaner);

        if (null == tempFilterArray.find((item) => Array.isArray(item))) {
            throw Error(
                'Validation failed! Cannot create isolate query filter. No conditions found.'
            );
        }
        this.validateFilterArray(tempFilterArray);
        tempFilterArray.forEach((x) => filterArrayOutput.push(x));
    }

    validateFilterArray(filterArray: any[]) {
        filterArray.forEach((item) => {
            if (!Array.isArray(item) && item in LogicalOperator) {
                const operator: LogicalOperator | LogicalOperator[] =
                    LogicalOperator[item as keyof typeof LogicalOperator];
                if (_.isUndefined(operator)) {
                    throw Error(
                        'Validation failed! Cannot create isolate query filter. Operator is undefined.'
                    );
                }
            } else if (Array.isArray(item) && item[0] in LogicalOperator) {
                this.validateFilterArray(item);
            } else if (Array.isArray(item) && _.isString(item[0])) {
                // validate condition:[fieldName, comapareOperator, searchValue]
                let isolatePropertyName:
                    | keyof IsolateViewAttributes
                    | undefined;
                let resistancePropertyName:
                    | keyof ResistanceViewAttributes
                    | undefined;

                // filedName must match an existing ViewAttribute
                if (item[0].includes('resistance.')) {
                    resistancePropertyName =
                        item[0] as keyof ResistanceViewAttributes;
                } else {
                    isolatePropertyName =
                        item[0] as keyof IsolateViewAttributes;
                }
                // no field name match => Error
                const isResistanceCondition = !_.isUndefined(
                    resistancePropertyName
                );
                const isIsolateCondition =
                    !_.isUndefined(isolatePropertyName);
                if (!isResistanceCondition && !isIsolateCondition) {
                    throw Error(
                        'Validation failed! Cannot create isolate query filter. Unexpected Field in Condition detected.'
                    );
                }

                // check comapre operator
                let comparator;
                const whitelistedAliasArray = [
                    '=',
                    '!=',
                    '<',
                    '<=',
                    '<>',
                    '=>',
                    '>',
                ];
                const isCompareOperator = item[1] in CompareOperator;
                const alias = whitelistedAliasArray.find(
                    (alias) => item[1] === alias
                );
                const isCompareOperatorAlias = !_.isUndefined(alias);
                if (!isCompareOperator && !isCompareOperatorAlias) {
                    throw Error(
                        'Validation failed! Cannot create isolate query filter. Unexpected CompareOperatorValue in Condition detected.'
                    );
                }
                if (isCompareOperatorAlias) {
                    comparator = this.getCompareOperatorViaAlias(item[1]);
                } else {
                    comparator =
                        CompareOperator[
                            item[1] as keyof typeof CompareOperator
                        ];
                }
                if (_.isUndefined(comparator)) {
                    throw Error(
                        'Validation failed! Cannot create isolate query filter. ComapareOperator is undefined.'
                    );
                }
                // validate searchValue?
                const searchValue: string | number | (string | number)[] =
                    item[2];
                if (_.isUndefined(searchValue)) {
                    throw Error(
                        'Validation failed! Cannot create isolate query filter. The search value is undefined.'
                    );
                }
                if (
                    Array.isArray(searchValue) &&
                    comparator !== CompareOperator.IN &&
                    comparator !== CompareOperator.NOT_IN
                ) {
                    throw Error(
                        'Validation failed! Cannot create isolate query filter. The compare operator: ' +
                            comparator +
                            ' cannot be used with a list of search values.'
                    );
                }

                if (Array.isArray(searchValue)) {
                    searchValue.forEach((val) => {
                        if (_.isUndefined(val)) {
                            throw Error(
                                'Validation failed! Cannot create isolate query filter. One of the search values is undefined.'
                            );
                        }
                    });
                }
            }
        });
    }

    private getCompareOperatorViaAlias(alias: string): CompareOperator {
        let comparator;
        switch (alias) {
            case '=':
                comparator = CompareOperator.EQ;
                break;
            case '!=':
                comparator = CompareOperator.NEQ;
                break;
            case '<':
                comparator = CompareOperator.LT;
                break;
            case '<=':
                comparator = CompareOperator.LTE;
                break;
            case '>':
                comparator = CompareOperator.GT;
                break;
            case '=>':
                comparator = CompareOperator.GTE;
                break;
            default:
                throw new Error(
                    'Unknown comapreOperator alias detected with value: ' +
                        alias
                );
        }
        return comparator;
    }

    @httpGet('/:bfrId')
    async getIsolateByBfrId(
        @request() req: Request,
        @response() res: Response
    ) {
        logger.trace(
            `${this.constructor.name}.${this.getIsolate.name}, Received: ${req}`
        );
        try {
            // load Data
            const isolateArray: Isolate[] =
                await this.isolateService.getIsolateById(req.params.bfrId);
            // prepare result
            let dto: IsolateDTO | null = null;
            const hasIsolateResult =
                null != isolateArray && isolateArray.length === 1;
            if (hasIsolateResult) {
                // if the provided bfrId exists, the isolateArray
                // should contain only one item
                dto = this.isolateConverter.createIsolateDTOViaIsolate(
                    isolateArray[0]
                );
            }
            this.ok(res, dto);
        } catch (error) {
            logger.error('Unable to send response: ', error);
            this.handleError(res);
        }
    }

    private handleError(res: Response) {
        this.fail(res);
    }
}

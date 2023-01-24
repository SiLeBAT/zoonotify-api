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
    IsolateCollection,
    DataRequestCreatedEvent,
    createDataRequestCreatedEvent,
} from '../../app/ports';
import {
    GetIsolatesSuccessResponse,
    IsolateDTO,
} from '../model/response.model';
import { ConvertedQuery, IsolateController } from '../model/controller.model';
import { AbstractController } from './abstract.controller';
import { ROUTE } from '../model/enums';
import { logger } from '../../aspects';
import SERVER_TYPES from '../server.types';
import {
    QueryFilterConverter,
    QueryParameterToGroupingConverter,
    QueryParameterToQueryFilterConverter,
    IsolateConverter,
} from '../model/converter.model';
import _ = require('lodash');
import { IsolateQueryFilter } from 'src/app/query/domain/filter.model';

enum ISOLATE_ROUTE {
    ROOT = '/isolate',
}

@controller(ROUTE.VERSION + ISOLATE_ROUTE.ROOT)
export class DefaultIsolateController
    extends AbstractController
    implements IsolateController
{
    constructor(
        @inject(APPLICATION_TYPES.IsolateService)
        private isolateService: IsolatePort,
        @inject(SERVER_TYPES.QueryParameterToQueryFilterConverter)
        private parameterToFilterConverter: QueryParameterToQueryFilterConverter,
        @inject(SERVER_TYPES.QueryParameterToGroupingConverter)
        private parameterToGroupingConverter: QueryParameterToGroupingConverter,
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
            const filter: IsolateQueryFilter =
                this.queryFilterConverter.createIsolateQueryFilter(req);

            const isolateCollection: IsolateCollection =
                await this.isolateService.getIsolateListByIsolateQueryFilter(
                    filter
                );
            const dto: GetIsolatesSuccessResponse = {
                isolates: ([] = isolateCollection.isolates.map((isolate) =>
                    this.isolateConverter.createIsolateDTOViaIsolate(isolate)
                )),
            };
            this.ok(res, dto);
        } catch (error) {
            logger.error('Unable to send response: ', error);
            this.handleError(res);
        }
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
            // prepare queryParameter
            const convertedQuery = this.createIdentifierQueryParam(
                req.params.bfrId
            );
            const dataRequestCreated = await this.createDataRequest(
                convertedQuery
            );

            // request Data
            const isolateCollection: IsolateCollection =
                await this.isolateService.getIsolateById(dataRequestCreated);

            // create result
            let dto: IsolateDTO | null = null;
            if (
                null != isolateCollection &&
                isolateCollection.isolates.length === 1
            ) {
                dto = this.isolateConverter.createIsolateDTOViaIsolate(
                    isolateCollection.isolates[0]
                );
            }
            this.ok(res, dto);
        } catch (error) {
            logger.error('Unable to send response: ', error);
            this.handleError(res);
        }
    }

    private async createDataRequest(
        convertedQuery: ConvertedQuery
    ): Promise<DataRequestCreatedEvent> {
        const grouping =
            this.parameterToGroupingConverter.getGroupAttribute(convertedQuery);
        const filter =
            await this.parameterToFilterConverter.convertParameterToFilter(
                convertedQuery
            );
        return createDataRequestCreatedEvent(filter, grouping);
    }

    private createIdentifierQueryParam(identifier: string) {
        const result: Record<string, string[]> = {};
        if (!_.isEmpty(identifier)) {
            result['bfrId'] = [identifier];
        }
        return result;
    }

    private handleError(res: Response) {
        this.fail(res);
    }
}

import { GeneSet } from './../../app/query/domain/isolate.model';
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
    Isolate,
    DataRequestCreatedEvent,
    createDataRequestCreatedEvent,
} from '../../app/ports';
import {
    GetCountedIsolatesSuccessResponse,
    GetIsolatesSuccessResponse,
    IsolateDTO,
} from '../model/response.model';
import { ConvertedQuery, IsolateController } from '../model/controller.model';
import { AbstractController } from './abstract.controller';
import { ROUTE } from '../model/enums';
import { logger } from '../../aspects';
import SERVER_TYPES from '../server.types';
import {
    QueryParameterToGroupingConverter,
    QueryParameterToQueryFilterConverter,
} from '../model/converter.model';
import _ = require('lodash');
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
        private parameterToGroupingConverter: QueryParameterToGroupingConverter
    ) {
        super();
    }

    @httpGet('/')
    async getIsolate(@request() req: Request, @response() res: Response) {
        logger.trace(
            `${this.constructor.name}.${this.getIsolate.name}, Received: ${req}`
        );
        try {
            const convertedQuery = this.parseURLQueryParameters(
                req.query as Record<string, string | string[]>
            );

            const dataRequestCreated = await this.createDataRequest(
                convertedQuery
            );

            const isolateCollection: IsolateCollection =
                await this.isolateService.getIsolates(dataRequestCreated);

            const dto: GetIsolatesSuccessResponse = {
                isolates: isolateCollection.isolates.map((isolate) =>
                    this.isolateToDTO(isolate)
                ),
            };
            this.ok(res, dto);
        } catch (error) {
            logger.error('Unable to send response: ', error);
            this.handleError(res);
        }
    }

    @httpGet('/counted')
    async getIsolateCount(@request() req: Request, @response() res: Response) {
        logger.trace(
            `${this.constructor.name}.${this.getIsolateCount.name}, Received: ${req}`
        );
        try {
            const convertedQuery: ConvertedQuery = this.parseURLQueryParameters(
                req.query as Record<string, string | string[]>
            );

            const dataRequestCreated = await this.createDataRequest(
                convertedQuery
            );

            const isolateCount = await this.isolateService.getIsolateCount(
                dataRequestCreated
            );

            const dto: GetCountedIsolatesSuccessResponse = {
                totalNumberOfIsolates: isolateCount.totalNumberOfIsolates,
            };
            if (isolateCount.groups) {
                dto.groups = isolateCount.groups as any;
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
    private handleError(res: Response) {
        this.fail(res);
    }

    private isolateToDTO(isolate: Isolate): IsolateDTO {
        const characteristics: any = { ...isolate.getCharacteristics() };

        _.forEach(isolate.getGenes(), (v, gene: keyof GeneSet) => {
            if (v) {
                characteristics[gene] = '+';
            }
        });

        const resistance = { ...isolate.getResistances() };
        return {
            microorganism: isolate.microorganism,
            samplingYear: isolate.samplingYear,
            federalState: isolate.federalState,
            samplingContext: isolate.samplingContext,
            samplingStage: isolate.samplingStage,
            origin: isolate.origin,
            category: isolate.category,
            productionType: isolate.productionType,
            matrix: isolate.matrix,
            matrixDetail: isolate.matrixDetail,
            characteristics: characteristics,
            resistance: resistance,
        };
    }
}

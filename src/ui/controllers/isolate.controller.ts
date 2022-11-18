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
    IsolateDto,
    IsolateGeneDto,
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

    @httpGet('/:bfrId')
    async getIsolateByBfrId(
        @request() req: Request,
        @response() res: Response
    ) {
        logger.trace(
            `${this.constructor.name}.${this.getIsolate.name}, Received: ${req}`
        );
        try {
            // prepapare queryParameter
            const convertedQuery = this.createIdentifierQueryParam(
                req.params.bfrId
            );
            const dataRequestCreated = await this.createDataRequest(
                convertedQuery
            );

            // request Data
            const isolateCollection: IsolateCollection =
                await this.isolateService.getIsolates(dataRequestCreated);

            // create result
            let dto: IsolateDTO | null = null;
            if (
                null != isolateCollection &&
                isolateCollection.isolates.length === 1
            ) {
                dto = this.isolateToDTO(isolateCollection.isolates[0]);
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

    hasKeys(obj: any): boolean {
        return null != Object.keys(obj) && 0 < Object.keys(obj).length;
    }

    private isolateToDTO(isolate: Isolate): IsolateDTO {
        const hasGenes = this.hasKeys(isolate.getGenes());
        const hasCharacteristics = this.hasKeys(isolate.getCharacteristics());
        const hasResistences = this.hasKeys(isolate.getResistances());

        let characteristics: any;
        if (hasCharacteristics) {
            characteristics = isolate.getCharacteristics();
        }

        if (hasGenes && hasCharacteristics) {
            const geneDto = new IsolateGeneDto();
            characteristics.genes = geneDto.build(isolate.getGenes());
        }
        if (hasGenes && !hasCharacteristics) {
            characteristics = { genes: isolate.getGenes() };
        }

        let resistance: any;
        if (hasResistences) {
            resistance = isolate.getResistances();
        }

        return new IsolateDto(
            isolate.isolateId,
            isolate.bfrId,
            isolate.microorganism,
            isolate.samplingYear,
            isolate.federalState,
            isolate.samplingContext,
            isolate.samplingStage,
            isolate.origin,
            isolate.category,
            isolate.productionType,
            isolate.matrix,
            isolate.matrixDetail,
            characteristics,
            resistance
        );
    }
}

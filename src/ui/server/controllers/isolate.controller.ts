import {
    APPLICATION_TYPES,
    Isolate,
    IsolatePort,
    IsolateCollection,
    FilterPort
} from '../../../app/ports';
import {
    GetCountedIsolatesSuccessResponse,
    GetIsolatesSuccessResponse,
    IsolateDTO
} from '../model/response.model';
import { IsolateController } from '../model/controller.model';
import { Response, Request } from 'express';
import { AbstractController } from './abstract.controller';
import {
    controller,
    httpGet,
    request,
    response
} from 'inversify-express-utils';
import { ROUTE } from '../model/enums';
import { inject } from 'inversify';
import { logger } from './../../../aspects';

enum ISOLATE_ROUTE {
    ROOT = '/isolate'
}
@controller(ROUTE.VERSION + ISOLATE_ROUTE.ROOT)
export class DefaultIsolateController extends AbstractController
    implements IsolateController {
    constructor(
        @inject(APPLICATION_TYPES.IsolateService)
        private isolateService: IsolatePort,
        @inject(APPLICATION_TYPES.FilterService)
        private filterService: FilterPort
    ) {
        super();
    }

    @httpGet('/')
    async getIsolate(@request() req: Request, @response() res: Response) {
        try {
            const filter = await this.filterService.createFilter(
                req.query as Record<string, string | string[]>
            );

            const isolates: IsolateCollection = await this.isolateService.getIsolates(
                filter
            );

            const dto: GetIsolatesSuccessResponse = {
                isolates: isolates.map(isolate => this.isolateToDTO(isolate))
            };
            this.ok(res, dto);
        } catch (error) {
            logger.error('Unable to send response: ', error);
            this.handleError(res);
        }
    }

    @httpGet('/counted')
    async getIsolateCount(@request() req: Request, @response() res: Response) {
        try {
            const filter = await this.filterService.createFilter(
                req.query as Record<string, string | string[]>
            );

            const isolateCount = await this.isolateService.getIsolateCount(
                filter
            );

            const dto: GetCountedIsolatesSuccessResponse = {
                totalNumberOfIsolates: isolateCount
            };
            this.ok(res, dto);
        } catch (error) {
            this.handleError(res);
        }
    }

    private handleError(res: Response) {
        this.fail(res);
    }

    private isolateToDTO(isolate: Isolate): IsolateDTO {
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
            characteristics: isolate.characteristics,
            resistance: isolate.resistance
        };
    }
}

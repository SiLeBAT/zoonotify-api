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
    FilterResolutionPort,
    GroupPort,
    IsolateView,
} from '../../app/ports';
import {
    GetCountedIsolatesSuccessResponse,
    GetIsolatesSuccessResponse,
    IsolateDTO,
} from '../model/response.model';
import { IsolateController } from '../model/controller.model';
import { AbstractController } from './abstract.controller';
import { ROUTE } from '../model/enums';
import { logger } from '../../aspects';

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
        @inject(APPLICATION_TYPES.FilterResolutionService)
        private filterResolutionService: FilterResolutionPort,
        @inject(APPLICATION_TYPES.GroupService)
        private groupService: GroupPort
    ) {
        super();
    }

    @httpGet('/')
    async getIsolate(@request() req: Request, @response() res: Response) {
        logger.trace(
            `${this.constructor.name}.${this.getIsolate.name}, Received: ${req}`
        );
        try {
            const filter = await this.filterResolutionService.createFilter(
                req.query as Record<string, string | string[]>
            );

            const isolates: IsolateCollection =
                await this.isolateService.getIsolates(filter);

            const dto: GetIsolatesSuccessResponse = {
                isolates: isolates.map((isolate) => this.isolateToDTO(isolate)),
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
            const groupAttributes = this.groupService.getGroupAttribute(
                req.query as Record<string, string | string[]>
            );

            const filter = await this.filterResolutionService.createFilter(
                req.query as Record<string, string | string[]>
            );

            const isolateCount = await this.isolateService.getIsolateCount(
                filter,
                groupAttributes
            );

            const dto: GetCountedIsolatesSuccessResponse = {
                totalNumberOfIsolates: isolateCount.totalNumberOfIsolates,
            };
            if (isolateCount.groups) {
                dto.groups = isolateCount.groups;
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

    private isolateToDTO(isolate: IsolateView): IsolateDTO {
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
            resistance: isolate.resistance,
        };
    }
}

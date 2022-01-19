import { Response } from 'express';
import { controller, httpGet, response } from 'inversify-express-utils';
import { ResistanceController } from '../model/controller.model';
import { AbstractController } from './abstract.controller';
import { ROUTE } from '../model/enums';
import { inject } from 'inversify';
import { IsolatePort, APPLICATION_TYPES } from '../../app/ports';

enum INFO_ROUTE {
    ROOT = '/resistance',
}
@controller(ROUTE.VERSION + INFO_ROUTE.ROOT)
export class DefaultResistanceController
    extends AbstractController
    implements ResistanceController
{
    constructor(
        @inject(APPLICATION_TYPES.IsolateService)
        private isolateService: IsolatePort
    ) {
        super();
    }

    @httpGet('/')
    async getResistance(@response() res: Response) {
        try {
            const result = await this.isolateService.getResistances();
            const dto = {
                resistances: Array.from(result),
            };
            this.ok(res, dto);
        } catch (error) {
            this.handleError(res);
        }
    }

    private handleError(res: Response) {
        this.fail(res, 'Unable to retrieve system information');
    }
}

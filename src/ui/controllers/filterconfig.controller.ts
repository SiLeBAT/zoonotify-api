import { Response, Request } from 'express';
import {
    controller,
    httpGet,
    request,
    requestParam,
    response,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { FilterConfiguration } from '../../app/query/model/filter.model';
import { FilterResolutionPort, FilterConfigurationPort } from '../../app/ports';
import {
    GetFilterConfigurationContainerDTO,
    FilterConfigurationDTO,
} from '../model/response.model';
import { FilterConfigController } from '../model/controller.model';
import { AbstractController } from './abstract.controller';
import { ROUTE } from '../model/enums';
import { APPLICATION_TYPES } from '../../app/application.types';
import { logger } from '../../aspects';

enum FILTER_CONFIG_ROUTE {
    ROOT = '/filterconfig',
}
@controller(ROUTE.VERSION + FILTER_CONFIG_ROUTE.ROOT)
export class DefaultFilterConfigController
    extends AbstractController
    implements FilterConfigController
{
    constructor(
        @inject(APPLICATION_TYPES.FilterResolutionService)
        private filterResolutionService: FilterResolutionPort,
        @inject(APPLICATION_TYPES.FilterConfigurationProvider)
        private filterConfigurationProvider: FilterConfigurationPort
    ) {
        super();
    }

    @httpGet('/')
    async getFilterConfiguration(@response() res: Response) {
        logger.trace(
            `${this.constructor.name}.${this.getFilterConfiguration.name}`
        );
        try {
            const filterConfigs =
                await this.filterConfigurationProvider.getFilterConfigurationCollection();

            const dto: GetFilterConfigurationContainerDTO = {
                filters: filterConfigs.map((config) =>
                    this.filterConfigurationToDTO(config)
                ),
            };
            this.ok(res, dto);
        } catch (error) {
            this.handleError(res);
        }
    }

    @httpGet('/:id')
    async getSpecificFilterConfiguration(
        @requestParam('id') id: string,
        @request() req: Request,
        @response() res: Response
    ) {
        logger.trace(
            `${this.constructor.name}.${this.getSpecificFilterConfiguration.name}, Received: ${req}`
        );

        try {
            const convertedQuery = this.parseURLQueryParameters(
                req.query as Record<string, string | string[]>
            );
            const filter = await this.filterResolutionService.createFilter(
                convertedQuery
            );

            const filterConfig =
                await this.filterConfigurationProvider.getFilterConfigurationById(
                    id,
                    filter
                );

            const dto: GetFilterConfigurationContainerDTO = {
                filters: [this.filterConfigurationToDTO(filterConfig)],
            };
            this.ok(res, dto);
        } catch (error) {
            this.handleError(res);
        }
    }

    private handleError(res: Response) {
        this.fail(res, 'Unable to retrieve system information');
    }

    private filterConfigurationToDTO(
        configuration: FilterConfiguration
    ): FilterConfigurationDTO {
        return { ...configuration };
    }
}

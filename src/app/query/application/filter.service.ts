import { MatrixRepository } from './../model/matrix.model';
// npm
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { ProbenahmegrundRepository } from './../model/probenahmegrund.model';
import { ErregerRepository } from '../model/erreger.model';
import { APPLICATION_TYPES } from './../../application.types';
import {
    FilterConfiguration,
    FilterDefinition,
    FilterService
} from '../model/filter.model';
import { logger } from '../../../aspects';

@injectable()
export class DefaultFilterService implements FilterService {
    constructor(
        @inject(APPLICATION_TYPES.ErregerRepository)
        private erregerRepository: ErregerRepository,
        @inject(APPLICATION_TYPES.ProbenahmegrundRepository)
        private probenahmegrundRepository: ProbenahmegrundRepository,
        @inject(APPLICATION_TYPES.MatrixRepository)
        private matrixRepository: MatrixRepository
    ) {}

    private filterDefinitions: FilterDefinition[] = [
        {
            valueProvider: () =>
                this.erregerRepository
                    .retrieve()
                    .then(erreger => erreger.map(e => e.name))
                    .catch(err => {
                        logger.error(
                            `Could not retrieve filter values: ${err}`
                        );
                        return [];
                    }),
            id: 'erreger'
        },
        {
            valueProvider: () =>
                this.probenahmegrundRepository
                    .retrieve()
                    .then(probenahmegrund => probenahmegrund.map(p => p.name))
                    .catch(err => {
                        logger.error(
                            `Could not retrieve filter values: ${err}`
                        );
                        return [];
                    }),
            id: 'probenahmegrund'
        },
        {
            valueProvider: () =>
                this.matrixRepository
                    .retrieve()
                    .then(matrix => matrix.map(m => m.name))
                    .catch(err => {
                        logger.error(
                            `Could not retrieve filter values: ${err}`
                        );
                        return [];
                    }),
            id: 'matrix'
        }
    ];

    async getFilterConfiguration() {
        const filterConfiguration: FilterConfiguration[] = [];
        for (let index = 0; index < this.filterDefinitions.length; index++) {
            const configuration = await this.fromDefinitionToConfiguration(
                this.filterDefinitions[index]
            );
            filterConfiguration.push(configuration);
        }
        return filterConfiguration;
    }
    private async fromDefinitionToConfiguration(
        definition: FilterDefinition
    ): Promise<FilterConfiguration> {
        const values = await definition.valueProvider();
        return {
            id: definition.id,
            name: definition.id,
            values
        };
    }
}

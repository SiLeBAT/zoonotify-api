// npm
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';

import { IsolatRepository } from './../model/isolat.model';
import { ProbenahmegrundRepository } from './../model/probenahmegrund.model';
import { PERSISTENCE_TYPES } from './../../../infrastructure/persistence/persistence.types';
import { ErregerRepository } from '../model/erreger.model';
import {
    FilterConfiguration,
    FilterDefinition,
    FilterService
} from '../model/filter.model';
import { logger } from '../../../aspects';

@injectable()
export class DefaultFilterService implements FilterService {
    constructor(
        @inject(PERSISTENCE_TYPES.ErregerRepository)
        private erregerRepository: ErregerRepository,
        @inject(PERSISTENCE_TYPES.ProbenahmegrundRepository)
        private probenahmegrundRepository: ProbenahmegrundRepository,
        @inject(PERSISTENCE_TYPES.IsolatRepository)
        private isolatRepository: IsolatRepository
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
            relation: 'erreger'
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
            relation: 'probenahmegrund'
        },
        {
            valueProvider: () =>
                this.isolatRepository
                    .retrieve()
                    .then(isolat =>
                        _.uniq(isolat.map(p => p.programm_beschreibung))
                    )
                    .catch(err => {
                        logger.error(
                            `Could not retrieve filter values: ${err}`
                        );
                        return [];
                    }),
            relation: 'isolat',
            column: 'programm_beschreibung'
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
            id: definition.column || definition.relation,
            name: definition.column || definition.relation,
            values
        };
    }
}

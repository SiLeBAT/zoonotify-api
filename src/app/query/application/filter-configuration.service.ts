import { FilterDefinitionCollection } from './../model/filter.model';
import { SamplingContextGateway } from './../model/sampling-context.model';
import { MatrixGateway } from './../model/matrix.model';
import { MicroorganismGateway } from './../model/microorganism.model';

// npm
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    FilterConfiguration,
    FilterDefinition,
    FilterConfigurationService,
    FilterConfigurationCollection
} from '../model/filter.model';
import { APPLICATION_TYPES } from '../../application.types';

@injectable()
export class DefaultFilterConfigurationService
    implements FilterConfigurationService {
    constructor(
        @inject(APPLICATION_TYPES.MicroorganismGateway)
        private microorganismGateway: MicroorganismGateway,
        @inject(APPLICATION_TYPES.MatrixGateway)
        private matrixGateway: MatrixGateway,
        @inject(APPLICATION_TYPES.SamplingReasonGateway)
        private samplingContextGateway: SamplingContextGateway
    ) {}

    private filterDefinitions: FilterDefinitionCollection = [
        {
            valueProvider: () =>
                this.microorganismGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'microorganism'
        },
        {
            valueProvider: () =>
                this.samplingContextGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'sContext'
        },
        {
            valueProvider: () =>
                this.matrixGateway.findAll().then(ary => ary.map(p => p.name)),
            id: 'matrix'
        }
    ];

    async getFilterConfiguration(): Promise<FilterConfigurationCollection> {
        const filterConfiguration: FilterConfigurationCollection = [];
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

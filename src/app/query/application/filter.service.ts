import { IsolateView, IsolateViewGateway } from './../model/isolate.model';
import { FilterDefinitionCollection } from './../model/filter.model';

// npm
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    FilterConfiguration,
    FilterService,
    FilterConfigurationCollection
} from '../model/filter.model';
import { APPLICATION_TYPES } from '../../application.types';
import { Filter } from '../model/shared.model';

@injectable()
export class DefaultFilterService implements FilterService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateViewGateway: IsolateViewGateway
    ) {}

    readonly filterDefinitions: FilterDefinitionCollection = [
        'samplingYear',
        'microorganism',
        'samplingContext',
         'matrix',
         'federalState',
         'samplingStage',
         'origin',
         'category',
         'productionType',
         'resistance'
    ];

    async getFilterConfiguration(filterName: string, filter?: Filter): Promise<FilterConfiguration> {
        return this.fromDefinitionToConfiguration(
            filterName as keyof IsolateView,
            filter
        );
    }

    async getAllFilterConfiguration(): Promise<FilterConfigurationCollection> {
        const filterConfiguration: FilterConfigurationCollection = [];
        for (let index = 0; index < this.filterDefinitions.length; index++) {
            const configuration = await this.getFilterConfiguration(
                this.filterDefinitions[index]
            );
            filterConfiguration.push(configuration);
        }
        return filterConfiguration;
    }

    private async fromDefinitionToConfiguration(
        definition: keyof IsolateView, filter?: Filter
    ): Promise<FilterConfiguration> {
        const values = await this.isolateViewGateway.getUniqueAttributeValues(definition, filter)
        return {
            id: definition,
            values
        };
    }

    async createFilter(
        query: Record<string, string | string[]>
    ): Promise<Filter> {
        return _.chain(query)
            .pick(this.filterDefinitions)
            .reduce((result, value, key: string) => {
                result[key] = value;
                return result;
            }, {} as Filter)
            .value();
    }
}

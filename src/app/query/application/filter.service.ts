import { OriginGateway } from './../model/origin.model';
import {
    FilterDefinitionCollection,
    FilterNamesToAttributesHash
} from './../model/filter.model';
import { SamplingContextGateway } from './../model/sampling-context.model';
import { MatrixGateway } from './../model/matrix.model';
import { MicroorganismGateway } from './../model/microorganism.model';

// npm
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    FilterConfiguration,
    FilterDefinition,
    FilterService,
    FilterConfigurationCollection
} from '../model/filter.model';
import { APPLICATION_TYPES } from '../../application.types';
import { Filter } from '../model/shared.model';
import { SamplingStageGateway } from '../model/sampling-stage.model';
import { FederalStateGateway } from '../model/federal-state.model';
import { CategoryGateway } from '../model/category.model';
import { ProductionTypeGateway } from '../model/production-type.model';
import { ResistanceGateway } from '../model/resistance.model';

@injectable()
export class DefaultFilterService implements FilterService {
    constructor(
        @inject(APPLICATION_TYPES.MicroorganismGateway)
        private microorganismGateway: MicroorganismGateway,
        @inject(APPLICATION_TYPES.MatrixGateway)
        private matrixGateway: MatrixGateway,
        @inject(APPLICATION_TYPES.SamplingContextGateway)
        private samplingContextGateway: SamplingContextGateway,
        @inject(APPLICATION_TYPES.SamplingStageGateway)
        private samplingStageGateway: SamplingStageGateway,
        @inject(APPLICATION_TYPES.FederalStateGateway)
        private federalStateGateway: FederalStateGateway,
        @inject(APPLICATION_TYPES.OriginGateway)
        private originGateway: OriginGateway,
        @inject(APPLICATION_TYPES.CategoryGateway)
        private categoryGateway: CategoryGateway,
        @inject(APPLICATION_TYPES.ProductionTypeGateway)
        private productionTypeGateway: ProductionTypeGateway,
        @inject(APPLICATION_TYPES.ResistanceGateway)
        private resistanceGateway: ResistanceGateway
    ) {}

    readonly filterDefinitions: FilterDefinitionCollection = [
        {
            valueProvider: () =>
                this.microorganismGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'microorganism',
            modelAttribute: 'microorganism'
        },
        {
            valueProvider: () =>
                this.samplingContextGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'sContext',
            modelAttribute: 'samplingContext'
        },
        {
            valueProvider: () =>
                this.matrixGateway.findAll().then(ary => ary.map(p => p.name)),
            id: 'matrix',
            modelAttribute: 'matrix'
        },
        {
            valueProvider: () =>
                this.federalStateGateway
                    .findAll()
                    .then(ary => ary.map(p => p.toString())),
            id: 'fState',
            modelAttribute: 'federalState'
        },
        {
            valueProvider: () =>
                this.samplingStageGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'sStage',
            modelAttribute: 'samplingStage'
        },
        {
            valueProvider: () =>
                this.originGateway.findAll().then(ary => ary.map(p => p.name)),
            id: 'origin',
            modelAttribute: 'origin'
        },
        {
            valueProvider: () =>
                this.categoryGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'category',
            modelAttribute: 'category'
        },
        {
            valueProvider: () =>
                this.productionTypeGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'productionType',
            modelAttribute: 'productionType'
        },
        {
            valueProvider: () =>
                this.resistanceGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'resistance',
            modelAttribute: 'resistance'
        }
    ];

    get filterNamesToAttributes() {
        return this.filterDefinitions.reduce((acc, current) => {
            acc[current.id] = current.modelAttribute;
            return acc;
        }, {} as FilterNamesToAttributesHash);
    }

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
            values
        };
    }

    async createFilter(
        query: Record<string, string | string[]>
    ): Promise<Filter> {
        return _.chain(query)
            .pick(Object.keys(this.filterNamesToAttributes))
            .reduce((result, value, key: string) => {
                if (this.filterNamesToAttributes[key]) {
                    result[this.filterNamesToAttributes[key]] = value;
                }
                return result;
            }, {} as Filter)
            .value();
    }
}

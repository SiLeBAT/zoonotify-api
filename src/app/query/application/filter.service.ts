import { ProgramGateway } from './../model/program.model';
import { OriginGateway } from './../model/origin.model';
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
        private resistanceGateway: ResistanceGateway,
        @inject(APPLICATION_TYPES.ProgramGateway)
        private programGateway: ProgramGateway
    ) {}

    readonly filterDefinitions: FilterDefinitionCollection = [
        {
            valueProvider: () =>
                this.programGateway
                    .findAll()
                    .then(ary => _.uniq(ary.map(p => p.samplingYear))),
            id: 'samplingYear'
        },
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
            id: 'samplingContext'
        },
        {
            valueProvider: () =>
                this.matrixGateway.findAll().then(ary => ary.map(p => p.name)),
            id: 'matrix'
        },
        {
            valueProvider: () =>
                this.federalStateGateway
                    .findAll()
                    .then(ary => ary.map(p => p.toString())),
            id: 'federalState'
        },
        {
            valueProvider: () =>
                this.samplingStageGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'samplingStage'
        },
        {
            valueProvider: () =>
                this.originGateway.findAll().then(ary => ary.map(p => p.name)),
            id: 'origin'
        },
        {
            valueProvider: () =>
                this.categoryGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'category'
        },
        {
            valueProvider: () =>
                this.productionTypeGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'productionType'
        },
        {
            valueProvider: () =>
                this.resistanceGateway
                    .findAll()
                    .then(ary => ary.map(p => p.name)),
            id: 'resistance'
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
            values
        };
    }

    async createFilter(
        query: Record<string, string | string[]>
    ): Promise<Filter> {
        return _.chain(query)
            .pick(this.filterDefinitions.map(d => d.id))
            .reduce((result, value, key: string) => {
                result[key] = value;
                return result;
            }, {} as Filter)
            .value();
    }
}

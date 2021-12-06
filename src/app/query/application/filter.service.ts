import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { IsolateViewGateway } from '../model/isolate.model';
import {
    FilterDefinitionCollection,
    SubfilterDefinition,
    SubfilterDefinitionCollection,
    FilterDefinition,
} from '../model/filter.model';

// npm
import {
    FilterConfiguration,
    FilterService,
    FilterConfigurationCollection,
} from '../model/filter.model';
import { APPLICATION_TYPES } from '../../application.types';
import { QueryFilter } from '../model/shared.model';

@injectable()
export class DefaultFilterService implements FilterService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateViewGateway: IsolateViewGateway
    ) {}

    /* List of Main Filters */
    private readonly uiMainFilterDefinitionCollection: FilterDefinitionCollection =
        [
            {
                id: 'samplingYear',
                attribute: 'samplingYear',
            },
            {
                id: 'microorganism',
                attribute: 'microorganism',
            },
            {
                id: 'samplingContext',
                attribute: 'samplingContext',
            },
            {
                id: 'matrix',
                attribute: 'matrix',
            },
            {
                id: 'federalState',
                attribute: 'federalState',
            },
            {
                id: 'samplingStage',
                attribute: 'samplingStage',
            },
            {
                id: 'origin',
                attribute: 'origin',
            },
            {
                id: 'category',
                attribute: 'category',
            },
            {
                id: 'productionType',
                attribute: 'productionType',
            },
        ];

    /* List of Subfilters */
    private readonly uiSubfilterDefinitionCollection: SubfilterDefinitionCollection =
        [
            {
                id: 'serovar',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'Salmonella spp.',
                target: 'characteristic',
                targetValue: 'serovar',
            },
            {
                id: 'carba_ampc_carba_phenotype',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'CARBA-E. coli',
                target: 'characteristic',
                targetValue: 'AmpC_Carba_Phänotyp',
            },
            {
                id: 'esbl_ampc_carba_phenotype',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'ESBL/AmpC-E. coli',
                target: 'characteristic',
                targetValue: 'AmpC_Carba_Phänotyp',
            },
            {
                id: 'campy_spez',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'Campylobacter spp.',
                target: 'characteristic',
                targetValue: 'spez',
            },
            {
                id: 'entero_spez',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'Enterococcus spp.',
                target: 'characteristic',
                targetValue: 'spez',
            },
            {
                id: 'serotype',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'Listeria monocytogenes',
                target: 'characteristic',
                targetValue: 'serotyp',
            },
            {
                id: 'spa_type',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'MRSA',
                target: 'characteristic',
                targetValue: 'spa_Typ',
            },
            {
                id: 'clonal_group',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'MRSA',
                target: 'characteristic',
                targetValue: 'Klonale_Gruppe',
            },
            {
                id: 'o_group',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'STEC',
                target: 'characteristic',
                targetValue: 'O_Gruppe',
            },
            {
                id: 'h_group',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'STEC',
                target: 'characteristic',
                targetValue: 'H_Gruppe',
            },
        ];

    /* List of expanded Subfilters */
    private readonly uiExpandedFilterDefinitionCollection: (FilterDefinition &
        Partial<SubfilterDefinition>)[] = [
        {
            id: 'matrixDetail',
            attribute: 'matrixDetail',
            parent: 'matrix',
        },
    ];

    /* List of manual Subfilters */
    private readonly uiManualFilterDefinitionCollection: (FilterDefinition &
        Partial<SubfilterDefinition>)[] = [
        {
            id: 'genes',
            attribute: '',
            parent: 'microorganism',
            trigger: 'STEC',
        },
    ];

    /* List of manually configured Subfilters */
    private readonly manualFilterConfiguration: FilterConfiguration[] = [
        {
            id: 'genes',
            attribute: '',
            parent: 'microorganism',
            trigger: 'STEC',
            values: ['stx1_Gen', 'stx2_Gen', 'eae_Gen', 'e_hly_Gen'],
        },
    ];

    async getFilterConfiguration(
        id: string,
        attributeReduction?: QueryFilter
    ): Promise<FilterConfiguration> {
        const definition = this.findByIdInCollection(
            id,
            this.getAllFilterDefinitions()
        );

        if (!definition) throw new Error();

        return this.fromDefinitionToConfiguration(
            definition as FilterDefinition,
            attributeReduction
        );
    }

    async getAllFilterConfiguration(): Promise<FilterConfigurationCollection> {
        const filterConfiguration: FilterConfigurationCollection = [];

        const allDefinitions = [
            ...this.uiMainFilterDefinitionCollection,
            ...this.uiSubfilterDefinitionCollection,
            ...this.uiManualFilterDefinitionCollection,
        ];

        for (let index = 0; index < allDefinitions.length; index++) {
            const configuration = await this.getFilterConfiguration(
                allDefinitions[index].id
            );
            filterConfiguration.push(configuration);
        }

        for (
            let index = 0;
            index < this.uiExpandedFilterDefinitionCollection.length;
            index++
        ) {
            const config = _.find(filterConfiguration, (e) => {
                return (
                    e.id ===
                    this.uiExpandedFilterDefinitionCollection[index].parent
                );
            });

            if (!config) throw new Error();

            if (config.values.length) {
                for (let i = 0; i < config.values.length; i++) {
                    const expandedConfig =
                        await this.fromDefinitionToConfiguration({
                            ...this.uiExpandedFilterDefinitionCollection[index],
                            ...{ trigger: config.values[i] as string },
                        });
                    const configuration = {
                        ...expandedConfig,
                        ...{
                            id:
                                expandedConfig.id +
                                '_' +
                                expandedConfig.trigger,
                        },
                    };
                    filterConfiguration.push(configuration);
                }
            }
        }

        return filterConfiguration;
    }

    private getAllFilterDefinitions() {
        return [
            ...this.uiMainFilterDefinitionCollection,
            ...this.uiSubfilterDefinitionCollection,
            ...this.uiExpandedFilterDefinitionCollection,
            ...this.uiManualFilterDefinitionCollection,
        ];
    }

    private async fromDefinitionToConfiguration(
        {
            id,
            attribute,
            parent,
            trigger,
            target,
            targetValue,
        }: FilterDefinition & Partial<SubfilterDefinition>,
        filter?: QueryFilter
    ): Promise<FilterConfiguration> {
        if (parent && trigger) {
            filter = {
                ...filter,
                ...{
                    [parent]: trigger,
                },
            };
        }

        if (target && targetValue) {
            filter = {
                ...filter,
                ...{
                    [target]: targetValue,
                },
            };
        }

        let configuration: Partial<FilterConfiguration> | undefined =
            this.findByIdInCollection(id, [...this.manualFilterConfiguration]);

        if (!configuration) {
            const values =
                await this.isolateViewGateway.getUniqueAttributeValues(
                    attribute,
                    filter
                );
            configuration = {
                id: id,
                attribute: id,
                parent,
                trigger,
                values,
            };
        }
        if (!configuration) throw new Error();
        return configuration as FilterConfiguration;
    }

    async createFilter(
        query: Record<string, string | string[]>
    ): Promise<QueryFilter> {
        const idCollection = this.getAllFilterDefinitions().map((d) => d.id);
        return _.chain(query)
            .pick(idCollection)
            .reduce((result, value, key: string) => {
                result[key] = value;
                return result;
            }, {} as QueryFilter)
            .value();
    }

    private findByIdInCollection = (
        id: string,
        collection: Partial<{ id: string }>[]
    ) => {
        const findById = (e: Partial<{ id: string }>) => {
            return e.id === id;
        };

        const found = _.find(collection, findById);
        return found;
    };
}

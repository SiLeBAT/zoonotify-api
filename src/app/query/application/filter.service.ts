import { QueryParameters } from './../model/shared.model';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { IsolateViewGateway } from '../model/isolate.model';
import {
    FilterDefinitionCollection,
    SubfilterDefinition,
    SubfilterDefinitionCollection,
    FilterDefinition,
    DependentFilter,
    IdentifiedEntry,
} from '../model/filter.model';

// npm
import {
    FilterConfiguration,
    FilterService,
    FilterConfigurationCollection,
} from '../model/filter.model';
import { APPLICATION_TYPES } from '../../application.types';
import { QueryFilter } from '../model/shared.model';
import { logger } from '../../../aspects';

@injectable()
export class DefaultFilterService implements FilterService {
    private filterConfigurationCollection: Promise<FilterConfigurationCollection>;
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateViewGateway: IsolateViewGateway
    ) {
        this.filterConfigurationCollection =
            this.createFilterConfigurationCollection();
    }

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

    /* List of dynamically generated Subfilters */
    private readonly uiDynamicFilterDefinitionCollection: (FilterDefinition &
        Partial<SubfilterDefinition>)[] = [
        {
            id: 'matrixDetail',
            attribute: 'matrixDetail',
            parent: 'matrix',
        },
    ];

    /* List of manually created Subfilters */
    private readonly uiManualFilterDefinitionCollection: SubfilterDefinition[] =
        [
            {
                id: 'genes',
                attribute: 'characteristic',
                parent: 'microorganism',
                trigger: 'STEC',
                target: 'characteristicValue',
                targetValue: '+',
            },
        ];

    /* List of manually configured Subfilters */
    private readonly manualFilterConfiguration: FilterConfiguration[] = [
        {
            id: 'genes',
            parent: 'microorganism',
            trigger: 'STEC',
            values: ['stx1_Gen', 'stx2_Gen', 'eae_Gen', 'e_hly_Gen'],
        },
    ];

    async getFilterConfigurationById(
        id: string,
        attributeReduction?: QueryFilter
    ): Promise<FilterConfiguration> {
        let trueId = id;
        if (this.determineFilterType(id) === FilterType.DYNAMIC) {
            [trueId] = id.split('__');
        }
        const definition = this.findByIdInCollection(
            trueId,
            this.getCombinedFilterDefinitions()
        );

        if (!definition) {
            throw new Error(`No Filter Configuration found for id: ${id}`);
        }

        return this.fromDefinitionToConfiguration(
            definition as FilterDefinition,
            attributeReduction
        );
    }

    getFilterConfigurationCollection(): Promise<FilterConfigurationCollection> {
        return this.filterConfigurationCollection;
    }

    private getCombinedFilterDefinitions() {
        return [
            ...this.uiMainFilterDefinitionCollection,
            ...this.uiSubfilterDefinitionCollection,
            ...this.uiDynamicFilterDefinitionCollection,
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
        const isSubfilter = parent && trigger;
        const hasOwnEntry = target && targetValue;
        if (isSubfilter) {
            filter = {
                ...filter,
                ...{
                    [parent]: trigger,
                },
            };
        }

        if (hasOwnEntry) {
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
                parent,
                trigger,
                values,
            };
        }
        if (!configuration) throw new Error();
        return configuration as FilterConfiguration;
    }

    async createFilter(query: QueryParameters): Promise<QueryFilter> {
        const dependentFilters: DependentFilter[] = [];
        const independentFilter: QueryFilter = {};

        _.forEach(query, (value, key) => {
            const filterType = this.determineFilterType(key);
            switch (filterType) {
                case FilterType.DYNAMIC:
                    const [dependent, trigger] = key.split('__');
                    const dynamicDefinition = this.findByIdInCollection(
                        dependent,
                        this.uiDynamicFilterDefinitionCollection
                    ) as SubfilterDefinition;
                    dependentFilters.push({
                        parent: dynamicDefinition.parent,
                        child: {
                            trigger,
                            dependent: {
                                [dependent]: value,
                            },
                        },
                    });
                    break;
                case FilterType.MANUAL:
                    const manualDefinition = this.findByIdInCollection(
                        key,
                        this.uiManualFilterDefinitionCollection
                    ) as SubfilterDefinition;
                    dependentFilters.push({
                        parent: manualDefinition.parent,
                        child: {
                            trigger: manualDefinition.trigger,
                            dependent: {
                                [manualDefinition.attribute]: value,
                                [manualDefinition.target]:
                                    manualDefinition.targetValue,
                            },
                        },
                    });
                    break;
                case FilterType.SUB:
                    const subFilterDefinition = this.findByIdInCollection(
                        key,
                        this.uiSubfilterDefinitionCollection
                    ) as SubfilterDefinition;
                    dependentFilters.push({
                        parent: subFilterDefinition.parent,
                        child: {
                            trigger: subFilterDefinition.trigger,
                            dependent: {
                                [subFilterDefinition.attribute]: value,
                                [subFilterDefinition.target]:
                                    subFilterDefinition.targetValue,
                            },
                        },
                    });
                    break;
                case FilterType.MAIN:
                default:
                    if (
                        !_.isUndefined(
                            this.findByIdInCollection(
                                key,
                                this.getCombinedFilterDefinitions()
                            )
                        )
                    ) {
                        independentFilter[key] = value;
                    }
            }
        });

        const queryFilter = this.mergeDependentIntoIndependentFilter(
            dependentFilters,
            independentFilter
        );
        return queryFilter;
    }

    private determineFilterType(id: string) {
        let type = FilterType.MAIN;

        if (id.includes('__')) {
            type = FilterType.DYNAMIC;
        } else if (
            this.findByIdInCollection(
                id,
                this.uiManualFilterDefinitionCollection
            )
        ) {
            type = FilterType.MANUAL;
        } else if (
            this.findByIdInCollection(id, this.uiSubfilterDefinitionCollection)
        ) {
            type = FilterType.SUB;
        }
        return type;
    }

    private mergeDependentIntoIndependentFilter(
        dependentFilters: DependentFilter[],
        independentFilter: QueryFilter
    ) {
        const allFilter = { ...independentFilter };
        _.forEach(allFilter, (value, key) => {
            const dependents = _.filter(
                dependentFilters,
                (e) => e.parent === key
            );
            if (dependents.length > 0) {
                _.forEach(dependents, (d) => {
                    _.remove(value, (e) => e === d.child.trigger);
                    if (_.isArray(value)) {
                        value.push({
                            ...d.child,
                        });
                    } else {
                        allFilter[key] = [
                            {
                                ...d.child,
                            },
                        ];
                    }
                });
            }
        });

        return allFilter;
    }

    private findByIdInCollection = (
        id: string,
        collection: IdentifiedEntry[]
    ) => {
        const findById = (e: IdentifiedEntry) => {
            return e.id === id;
        };

        const found = _.find(collection, findById);
        return found;
    };

    private async createFilterConfigurationCollection(): Promise<FilterConfigurationCollection> {
        logger.info('Creating Filter Configuration from Definitions.');

        const filterConfiguration: FilterConfigurationCollection = [];

        const allDefinitions = [
            ...this.uiMainFilterDefinitionCollection,
            ...this.uiSubfilterDefinitionCollection,
            ...this.uiManualFilterDefinitionCollection,
        ];

        for (let index = 0; index < allDefinitions.length; index++) {
            const configuration = await this.getFilterConfigurationById(
                allDefinitions[index].id
            );
            filterConfiguration.push(configuration);
        }

        const dynamicConfiguration =
            await this.createDynamicFilterConfiguration(filterConfiguration);

        return [...filterConfiguration, ...dynamicConfiguration];
    }

    private async createDynamicFilterConfiguration(
        filterConfiguration: FilterConfigurationCollection
    ) {
        const result: FilterConfigurationCollection = [];
        for (
            let index = 0;
            index < this.uiDynamicFilterDefinitionCollection.length;
            index++
        ) {
            const findParentFilterConfiguration = (
                element: Partial<SubfilterDefinition>,
                parentCollection: FilterConfigurationCollection
            ) => {
                return _.find(parentCollection, (e) => {
                    return e.id === element.parent;
                });
            };

            const currentDynamicDefinition =
                this.uiDynamicFilterDefinitionCollection[index];

            const parentConfiguration = findParentFilterConfiguration(
                currentDynamicDefinition,
                filterConfiguration
            );

            if (!parentConfiguration) throw new Error();

            if (parentConfiguration.values.length) {
                for (let i = 0; i < parentConfiguration.values.length; i++) {
                    const expandedConfig =
                        await this.fromDefinitionToConfiguration({
                            ...currentDynamicDefinition,
                            ...{
                                trigger: parentConfiguration.values[
                                    i
                                ] as string,
                            },
                        });
                    const configuration = {
                        ...expandedConfig,
                        ...{
                            id:
                                expandedConfig.id +
                                '__' +
                                expandedConfig.trigger,
                        },
                    };
                    result.push(configuration);
                }
            }
        }
        return result;
    }
}

enum FilterType {
    DYNAMIC,
    MAIN,
    SUB,
    MANUAL,
}

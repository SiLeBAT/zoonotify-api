import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { IsolateViewGateway } from '../domain/isolate.model';
import {
    FilterDefinitionCollection,
    SubfilterDefinition,
    SubfilterDefinitionCollection,
    FilterDefinition,
    IdentifiedEntry,
    FilterConfiguration,
    FilterConfigurationProvider,
    FilterConfigurationCollection,
    UIFilterType,
} from '../domain/filter.model';
import { APPLICATION_TYPES } from '../../application.types';
import { QueryFilter } from '../domain/shared.model';
import { logger } from '../../../aspects';
import { createQueryFilter } from '../domain/query-filter.entity';

@injectable()
export class DefaultFilterConfigurationProvider
    implements FilterConfigurationProvider
{
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
                dbTargetValue: 'serovar',
            },
            {
                id: 'carba_ampc_carba_phenotype',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'CARBA-E. coli',
                target: 'characteristic',
                dbTargetValue: 'ampc_carba_phenotype',
            },
            {
                id: 'esbl_ampc_carba_phenotype',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'ESBL/AmpC-E. coli',
                target: 'characteristic',
                dbTargetValue: 'ampc_carba_phenotype',
            },
            {
                id: 'campy_spez',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'Campylobacter spp.',
                target: 'characteristic',
                dbTargetValue: 'species',
            },
            {
                id: 'entero_spez',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'Enterococcus spp.',
                target: 'characteristic',
                dbTargetValue: 'species',
            },
            {
                id: 'serotype',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'Listeria monocytogenes',
                target: 'characteristic',
                dbTargetValue: 'serotype',
            },
            {
                id: 'spa_type',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'MRSA',
                target: 'characteristic',
                dbTargetValue: 'spa_type',
            },
            {
                id: 'clonal_group',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'MRSA',
                target: 'characteristic',
                dbTargetValue: 'clonal_group',
            },
            {
                id: 'o_group',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'STEC',
                target: 'characteristic',
                dbTargetValue: 'o_group',
            },
            {
                id: 'h_group',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'STEC',
                target: 'characteristic',
                dbTargetValue: 'h_group',
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
        {
            id: 'resistance',
            attribute: 'resistance',
            parent: 'microorganism',
        },
    ];

    /* List of manually created Subfilters */
    private readonly uiManualFilterDefinitionCollection: SubfilterDefinition[] =
        [
            {
                id: 'genes',
                attribute: 'characteristicValue',
                parent: 'microorganism',
                trigger: 'STEC',
                target: 'characteristic',
                dbTargetValue: '+',
            },
        ];
    /* List of manually configured Subfilters */
    private readonly manualFilterConfiguration: FilterConfiguration[] = [
        {
            id: 'genes',
            parent: 'microorganism',
            trigger: 'STEC',
            values: ['stx1', 'stx2', 'eae', 'e_hly'],
        },
    ];

    getFilterConfigurationById(
        id: string,
        attributeReduction?: QueryFilter
    ): Promise<FilterConfiguration & Partial<SubfilterDefinition>> {
        const [trueId] = this.parseDynamicFilterId(id);
        const definition = this.findByIdInCollection(
            trueId,
            this.getCombinedFilterDefinitions()
        ) as FilterDefinition;

        if (!definition) {
            throw new Error(`No Filter Configuration found for id: ${id}`);
        }

        return this.fromDefinitionToConfiguration(
            definition,
            attributeReduction
        );
    }

    getFilterConfigurationCollection() {
        return this.filterConfigurationCollection;
    }

    determineFilterType(id: string) {
        let type = UIFilterType.MAIN;

        if (id.includes('__')) {
            type = UIFilterType.DYNAMIC;
        } else if (
            this.findByIdInCollection(
                id,
                this.uiManualFilterDefinitionCollection
            )
        ) {
            type = UIFilterType.MANUAL;
        } else if (
            this.findByIdInCollection(id, this.uiSubfilterDefinitionCollection)
        ) {
            type = UIFilterType.SUB;
        }
        return type;
    }

    findDefinitionById(id: string): FilterDefinition {
        const type = this.determineFilterType(id);
        let result;
        switch (type) {
            case UIFilterType.DYNAMIC:
                result = this.findByIdInCollection(
                    id,
                    this.uiDynamicFilterDefinitionCollection
                );
                break;
            case UIFilterType.MANUAL:
                result = this.findByIdInCollection(
                    id,
                    this.uiManualFilterDefinitionCollection
                );
                break;
            case UIFilterType.SUB:
                result = this.findByIdInCollection(
                    id,
                    this.uiSubfilterDefinitionCollection
                ) as SubfilterDefinition;
                break;
            case UIFilterType.MAIN:
            default:
                result = this.findByIdInCollection(
                    id,
                    this.getCombinedFilterDefinitions()
                );
        }
        return (result as FilterDefinition) || null;
    }

    parseDynamicFilterId(id: string): [string, string | undefined] {
        const [trueId, trigger] = id.split('__');
        return [trueId, trigger];
    }

    private async fromDefinitionToConfiguration(
        {
            id,
            attribute,
            parent,
            trigger,
            target,
            dbTargetValue: targetValue,
        }: FilterDefinition & Partial<SubfilterDefinition>,
        filter: QueryFilter = createQueryFilter()
    ): Promise<FilterConfiguration> {
        const isSubfilter = parent && trigger;
        const hasOwnEntry = target && targetValue;

        if (isSubfilter) {
            filter.addFilter({
                key: parent,
                value: trigger,
            });
        }

        if (hasOwnEntry) {
            if (_.isUndefined(parent) || _.isUndefined(trigger)) {
                throw Error("Can't create Subfilter for " + target);
            }
            const parentId =
                filter.getIdOf({
                    key: parent,
                    value: trigger,
                }) ||
                filter.addFilter({
                    key: parent,
                    value: trigger,
                });

            filter.addFilter(
                {
                    key: target,
                    value: targetValue.toString(),
                },
                parentId
            );
        }

        let configuration: Partial<FilterConfiguration> | undefined =
            this.findByIdInCollection(id, [...this.manualFilterConfiguration]);

        if (!configuration) {
            const values =
                await this.isolateViewGateway.getUniqueAttributeValues(
                    attribute,
                    {
                        filter: filter,
                        grouping: [],
                    }
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

    private getCombinedFilterDefinitions() {
        return [
            ...this.uiMainFilterDefinitionCollection,
            ...this.uiSubfilterDefinitionCollection,
            ...this.uiDynamicFilterDefinitionCollection,
            ...this.uiManualFilterDefinitionCollection,
        ];
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

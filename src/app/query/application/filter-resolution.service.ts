import { QueryParameters, DependentQueryFilter } from '../model/shared.model';
import { injectable } from 'inversify';
import * as _ from 'lodash';
import {
    FilterDefinitionCollection,
    SubfilterDefinition,
    SubfilterDefinitionCollection,
    FilterDefinition,
    DependentFilter,
    IdentifiedEntry,
} from '../model/filter.model';

// npm
import { FilterResolutionService } from '../model/filter.model';
import { QueryFilter } from '../model/shared.model';
import { FilterType } from '../domain/filter-type.enum';

@injectable()
export class DefaultFilterResolutionService implements FilterResolutionService {
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
                attribute: 'characteristic',
                parent: 'microorganism',
                trigger: 'STEC',
                target: 'characteristicValue',
                targetValue: '+',
            },
        ];

    private getCombinedFilterDefinitions() {
        return [
            ...this.uiMainFilterDefinitionCollection,
            ...this.uiSubfilterDefinitionCollection,
            ...this.uiDynamicFilterDefinitionCollection,
            ...this.uiManualFilterDefinitionCollection,
        ];
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
                    let dependentValue;
                    if (!_.isArray(value)) {
                        dependentValue = [value];
                    } else {
                        dependentValue = value;
                    }
                    dependentValue.map((v) => {
                        const entry = {
                            parent: dynamicDefinition.parent,
                            child: {
                                trigger,
                                dependent: {
                                    [dependent]: v,
                                },
                            },
                        };

                        if (dependent === 'resistance') {
                            entry.child.dependent.resistance_active = 'true';
                        }
                        dependentFilters.push(entry);
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
                        if (_.isArray(allFilter[key])) {
                            (
                                allFilter[key] as Array<DependentQueryFilter>
                            ).push({
                                ...d.child,
                            });
                        } else {
                            allFilter[key] = [
                                {
                                    ...d.child,
                                },
                            ];
                        }
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
}

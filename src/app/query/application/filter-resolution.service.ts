import {
    FilterResolutionService,
    DependentFilter,
    FilterConfigurationProvider,
    SubfilterDefinition,
} from './../model/filter.model';
import { APPLICATION_TYPES } from './../../application.types';
import {
    QueryFilter,
    QueryParameters,
    DependentQueryFilter,
} from '../model/shared.model';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { FilterType } from '../domain/filter-type.enum';

@injectable()
export class DefaultFilterResolutionService implements FilterResolutionService {
    constructor(
        @inject(APPLICATION_TYPES.FilterConfigurationProvider)
        private filterConfigurationProvider: FilterConfigurationProvider,
        @inject(APPLICATION_TYPES.GroupingString)
        private groupingString: string
    ) {}
    async createFilter(query: QueryParameters): Promise<QueryFilter> {
        const dependentFilters: DependentFilter[] = [];
        const independentFilter: QueryFilter = {};

        if (!_.isUndefined(query[this.groupingString])) {
            query[this.groupingString].forEach((group) => {
                switch (group) {
                    case 'genes':
                        if (
                            _.isNil(independentFilter['characteristic_value'])
                        ) {
                            independentFilter['characteristic_value'] = ['+'];
                        } else {
                            independentFilter['characteristic_value'] = _.uniq([
                                ...independentFilter['characteristic_value'],
                                ...['+'],
                            ]);
                        }
                        if (_.isNil(independentFilter['characteristic'])) {
                            independentFilter['characteristic'] = [
                                'stx1',
                                'stx2',
                                'eae',
                                'e_hly',
                            ];
                        } else {
                            independentFilter['characteristic'] = _.uniq([
                                ...independentFilter['characteristic'],
                                ...['stx1', 'stx2', 'eae', 'e_hly'],
                            ]);
                        }
                        break;
                    case 'o_group':
                    case 'h_group':
                    case 'serovar':
                    case 'serotyp':
                    case 'clonal_group':
                    case 'spa_type':
                        if (_.isNil(independentFilter['characteristic'])) {
                            independentFilter['characteristic'] = [group];
                        } else {
                            independentFilter['characteristic'] = _.uniq([
                                ...independentFilter['characteristic'],
                                ...[group],
                            ]);
                        }
                        break;
                    case 'campy_spez':
                        if (_.isNil(independentFilter['characteristic'])) {
                            independentFilter['characteristic'] = ['spez'];
                        } else {
                            independentFilter['characteristic'] = _.uniq([
                                ...independentFilter['characteristic'],
                                ...['spez'],
                            ]);
                        }
                        if (_.isNil(independentFilter['microorganism'])) {
                            independentFilter['microorganism'] = [
                                'Campylobacter spp.',
                            ];
                        } else {
                            independentFilter['microorganism'] = _.uniq([
                                ...independentFilter['microorganism'],
                                ...['Campylobacter spp.'],
                            ]);
                        }
                        break;
                    case 'entero_spez':
                        if (_.isNil(independentFilter['characteristic'])) {
                            independentFilter['characteristic'] = ['spez'];
                        } else {
                            independentFilter['characteristic'] = _.uniq([
                                ...independentFilter['characteristic'],
                                ...['spez'],
                            ]);
                        }
                        if (_.isNil(independentFilter['microorganism'])) {
                            independentFilter['microorganism'] = [
                                'Enterococcus spp.',
                            ];
                        } else {
                            independentFilter['microorganism'] = _.uniq([
                                ...independentFilter['microorganism'],
                                ...['Enterococcus spp.'],
                            ]);
                        }
                        break;
                    case 'carba_ampc_carba_phenotype':
                        if (_.isNil(independentFilter['characteristic'])) {
                            independentFilter['characteristic'] = [
                                'ampc_carba_phenotype',
                            ];
                        } else {
                            independentFilter['characteristic'] = _.uniq([
                                ...independentFilter['characteristic'],
                                ...['ampc_carba_phenotype'],
                            ]);
                        }
                        if (_.isNil(independentFilter['microorganism'])) {
                            independentFilter['microorganism'] = [
                                'CARBA-E. coli',
                            ];
                        } else {
                            independentFilter['microorganism'] = _.uniq([
                                ...independentFilter['microorganism'],
                                ...['CARBA-E. coli'],
                            ]);
                        }
                        break;
                    case 'esbl_ampc_carba_phenotype':
                        if (_.isNil(independentFilter['characteristic'])) {
                            independentFilter['characteristic'] = [
                                'ampc_carba_phenotype',
                            ];
                        } else {
                            independentFilter['characteristic'] = _.uniq([
                                ...independentFilter['characteristic'],
                                ...['ampc_carba_phenotype'],
                            ]);
                        }
                        if (_.isNil(independentFilter['microorganism'])) {
                            independentFilter['microorganism'] = [
                                'ESBL/AmpC-E. coli',
                            ];
                        } else {
                            independentFilter['microorganism'] = _.uniq([
                                ...independentFilter['microorganism'],
                                ...['ESBL/AmpC-E. coli'],
                            ]);
                        }
                        break;
                    default:
                }
            });
        }

        _.forEach(query, (value, key) => {
            const filterType =
                this.filterConfigurationProvider.determineFilterType(key);

            const [filterId, trigger] =
                this.filterConfigurationProvider.parseDynamicFilterId(key);

            const definition =
                this.filterConfigurationProvider.findDefinitionById(
                    filterId
                ) as SubfilterDefinition;

            switch (filterType) {
                case FilterType.DYNAMIC:
                    if (!trigger) {
                        throw new Error(
                            'Dynamic Filter does not exist: ' + key
                        );
                    }
                    _.each(
                        this.createDependentDynamicFilter(
                            filterId,
                            trigger,
                            definition,
                            value
                        ),
                        (entry) => {
                            dependentFilters.push(entry);
                        }
                    );

                    break;
                case FilterType.MANUAL:
                case FilterType.SUB:
                    {
                        const dependentFilter = this.createDependentSubFilter(
                            definition,
                            value
                        );
                        dependentFilters.push(dependentFilter);
                    }
                    break;
                case FilterType.MAIN:
                    if (!_.isNull(definition)) {
                        independentFilter[filterId] = value;
                    }
                    break;
                default:
            }
        });

        const queryFilter = this.mergeDependentIntoIndependentFilter(
            dependentFilters,
            independentFilter
        );

        return queryFilter;
    }

    private createDependentDynamicFilter(
        id: string,
        trigger: string,
        definition: SubfilterDefinition,
        value: string[]
    ): DependentFilter[] {
        return value.map((v) => {
            const entry = {
                parent: definition.parent,
                child: {
                    trigger,
                    dependent: {
                        [id]: v,
                    },
                },
            };

            if (id === 'resistance') {
                entry.child.dependent.resistance_active = 'true';
            }

            return entry;
        });
    }

    private createDependentSubFilter(
        definition: SubfilterDefinition,
        attribute: string | string[]
    ) {
        return {
            parent: definition.parent,
            child: {
                trigger: definition.trigger,
                dependent: {
                    [definition.attribute]: attribute,
                    [definition.target]: definition.dbTargetValue,
                },
            },
        };
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
}

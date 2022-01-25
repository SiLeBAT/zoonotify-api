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
        private filterConfigurationProvider: FilterConfigurationProvider
    ) {}
    async createFilter(query: QueryParameters): Promise<QueryFilter> {
        const dependentFilters: DependentFilter[] = [];
        const independentFilter: QueryFilter = {};

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
                default:
                    if (!_.isNull(definition)) {
                        independentFilter[filterId] = value;
                    }
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
                    [definition.target]: definition.targetValue,
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

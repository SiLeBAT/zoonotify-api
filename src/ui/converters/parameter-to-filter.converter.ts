import {
    SubfilterDefinition,
    UIFilterType,
    FilterConfigurationPort,
    QueryFilter,
    APPLICATION_TYPES,
    createQueryFilter,
} from '../../app/ports';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import {
    QueryParameterToQueryFilterConverter,
    QueryParameters,
} from '../model/converter.model';
import SERVER_TYPES from '../server.types';

@injectable()
export class DefaultQueryParameterToQueryFilterConverter
    implements QueryParameterToQueryFilterConverter
{
    constructor(
        @inject(APPLICATION_TYPES.FilterConfigurationProvider)
        private filterConfigurationProvider: FilterConfigurationPort,
        @inject(SERVER_TYPES.GroupingString)
        private groupingString: string
    ) {}
    async convertParameterToFilter(
        query: QueryParameters
    ): Promise<QueryFilter> {
        const result: QueryFilter = createQueryFilter();

        if (!_.isUndefined(query[this.groupingString])) {
            query[this.groupingString].forEach((group) => {
                switch (group) {
                    case 'genes':
                        this.addCharacteristicFilterPair(result, 'stx1', '+');
                        this.addCharacteristicFilterPair(result, 'stx2', '+');
                        this.addCharacteristicFilterPair(result, 'eae', '+');
                        this.addCharacteristicFilterPair(result, 'e_hly', '+');
                        break;
                    case 'o_group':
                    case 'h_group':
                        {
                            const parentKey = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'STEC',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: group,
                                },
                                parentKey
                            );
                        }
                        break;
                    case 'serovar':
                        {
                            const parentKey = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'Salmonella Spp.',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: group,
                                },
                                parentKey
                            );
                        }
                        break;
                    case 'serotyp':
                        {
                            const parentKey = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'Listeria monocytogenes',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: group,
                                },
                                parentKey
                            );
                        }
                        break;

                    case 'clonal_group':
                    case 'spa_type':
                        {
                            const parentKey = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'MRSA',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: group,
                                },
                                parentKey
                            );
                        }
                        break;
                    case 'campy_spez':
                        {
                            const parentKey = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'Campylobacter spp.',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: 'species',
                                },
                                parentKey
                            );
                        }

                        break;
                    case 'entero_spez':
                        {
                            const pk = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'Enterococcus spp.',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: 'species',
                                },
                                pk
                            );
                        }
                        break;
                    case 'carba_ampc_carba_phenotype':
                        {
                            const pk = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'CARBA-E. coli',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: 'ampc_carba_phenotype',
                                },
                                pk
                            );
                        }

                        break;
                    case 'esbl_ampc_carba_phenotype':
                        {
                            const pk = result.addFilter(
                                {
                                    key: 'microorganism',
                                    value: 'ESBL/AmpC-E. coli',
                                },
                                null
                            );
                            result.addFilter(
                                {
                                    key: 'characteristic',
                                    value: 'ampc_carba_phenotype',
                                },
                                pk
                            );
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
                case UIFilterType.DYNAMIC:
                    if (!trigger) {
                        throw new Error(
                            'Dynamic Filter does not exist: ' + key
                        );
                    }
                    value.forEach((v) => {
                        this.createdependentsDynamicFilter(
                            trigger,
                            definition,
                            v,
                            result
                        );
                    });

                    break;
                case UIFilterType.MANUAL:
                    {
                        value.forEach((v) => {
                            this.createdependentsSubFilter(
                                definition,
                                v,
                                definition.dbTargetValue,
                                result
                            );
                        });
                    }
                    break;
                case UIFilterType.SUB:
                    {
                        value.forEach((v) => {
                            this.createdependentsSubFilter(
                                definition,
                                definition.dbTargetValue,
                                v,
                                result
                            );
                        });
                    }
                    break;
                case UIFilterType.MAIN:
                    if (!_.isNull(definition)) {
                        value.forEach((v) => {
                            result.addFilter(
                                {
                                    key: filterId,
                                    value: v,
                                },
                                null
                            );
                        });
                    }
                    break;
                default:
            }
        });

        return result;
    }
    addCharacteristicFilterPair(
        independentsFilter: QueryFilter,
        parentValue: string,
        childValue: string
    ) {
        const speciesKEy = independentsFilter.addFilter(
            {
                key: 'microorganism',
                value: 'STEC',
            },
            null
        );
        const parentKey = independentsFilter.addFilter(
            {
                key: 'characteristic',
                value: parentValue,
            },
            speciesKEy
        );
        independentsFilter.addFilter(
            {
                key: 'characteristic_value',
                value: childValue,
            },
            parentKey
        );
    }

    private createdependentsDynamicFilter(
        trigger: string,
        definition: SubfilterDefinition,
        value: string,
        result: QueryFilter
    ): QueryFilter {
        const pk = result.addFilter({
            key: definition.parent,
            value: trigger,
        });
        result.addFilter(
            {
                key: definition.attribute,
                value,
            },
            pk
        );

        return result;
    }

    private createdependentsSubFilter(
        definition: SubfilterDefinition,
        childValue: string,
        grandChildValue: string,
        result: QueryFilter
    ) {
        const pk = result.addFilter(
            {
                key: definition.parent,
                value: definition.trigger,
            },
            null
        );
        const sk = result.addFilter(
            {
                key: definition.target,
                value: childValue,
            },
            pk
        );
        result.addFilter(
            {
                key: definition.attribute,
                value: grandChildValue,
            },
            sk
        );

        return result;
    }
}

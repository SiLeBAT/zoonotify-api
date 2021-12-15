import { injectable } from 'inversify';
import * as _ from 'lodash';
import { Op } from 'sequelize';
import { QueryFilter, DependentQueryFilter } from '../../../../app/ports';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MyWhere = any;
export interface FilterConverter {
    convertFilter(filter: QueryFilter): {
        where?: MyWhere;
    };
}

@injectable()
export class SequelizeFilterConverter implements FilterConverter {
    convertFilter(filter: QueryFilter) {
        if (_.isEmpty(filter)) return filter;

        const whereClause: {
            where: MyWhere;
        } = {
            where: {},
        };

        _.forEach(filter, (value, key) => {
            if (_.isString(value)) {
                whereClause.where[key] = value;
            }
            if (_.isArray(value)) {
                const stringValues: string[] = [];
                const dependentFilters: DependentQueryFilter[] = [];
                _.forEach(value, (v) => {
                    if (this.isDependentQueryFilter(v)) {
                        dependentFilters.push(v);
                    } else {
                        stringValues.push(v);
                    }
                });
                if (dependentFilters.length > 0) {
                    whereClause.where[Op.or] = [];
                    if (stringValues.length > 0) {
                        whereClause.where[Op.or].push({ [key]: stringValues });
                    }
                    const parentAndChild = _.map(dependentFilters, (d) => {
                        return [
                            { [key]: d.trigger },
                            {
                                [Object.keys(d.dependent)[0]]: Object.values(
                                    d.dependent
                                )[0],
                            },
                        ];
                    });
                    whereClause.where[Op.or] = [
                        ...whereClause.where[Op.or],
                        ...parentAndChild.map((e) => ({ [Op.and]: e })),
                    ];
                } else {
                    whereClause.where[key] = stringValues;
                }
            }
        });

        return whereClause;
    }

    private isDependentQueryFilter(
        entry: string | DependentQueryFilter
    ): entry is DependentQueryFilter {
        return (
            (entry as DependentQueryFilter).trigger !== undefined &&
            (entry as DependentQueryFilter).dependent !== undefined
        );
    }
}

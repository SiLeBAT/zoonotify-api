import { injectable } from 'inversify';
import { Filter } from './../../../../app/ports';
import * as _ from 'lodash';

export interface FilterConverter {
    convertFilter(
        filter: Filter
    ): { where?: { [key: string]: string | string[] } };
}

@injectable()
export class SequelizeFilterConverter implements FilterConverter {
    convertFilter(filter: Filter) {
        if (_.isEmpty(filter)) return filter;

        const whereClause: { where: { [key: string]: string | string[] } } = {
            where: {}
        };

        _.forOwn(filter, (value, key) => {
            whereClause.where = { ...whereClause.where, ...{ [key]: value } };
        });
        return whereClause;
    }
}

import { injectable } from 'inversify';
import * as _ from 'lodash';
import { QueryFilter } from '../../../../app/ports';

export interface FilterConverter {
    convertFilter(filter: QueryFilter): {
        where?: { [key: string]: string | string[] };
    };
}

@injectable()
export class SequelizeFilterConverter implements FilterConverter {
    convertFilter(filter: QueryFilter) {
        if (_.isEmpty(filter)) return filter;

        const whereClause: { where: { [key: string]: string | string[] } } = {
            where: {},
        };

        _.forOwn(filter, (value, key) => {
            whereClause.where = { ...whereClause.where, ...{ [key]: value } };
        });
        return whereClause;
    }
}

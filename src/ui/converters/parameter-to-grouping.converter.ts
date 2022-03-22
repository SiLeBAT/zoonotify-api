import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { GroupAttributes } from '../../app/ports';
import { QueryParameterToGroupingConverter } from '../model/converter.model';
import SERVER_TYPES from '../server.types';

@injectable()
export class DefaultQueryParameterToGroupingConverter
    implements QueryParameterToGroupingConverter
{
    constructor(
        @inject(SERVER_TYPES.GroupingString)
        private groupingString: string
    ) {}

    getGroupAttribute(
        query: Record<string, string | string[]>
    ): GroupAttributes {
        let queryArray: GroupAttributes = [];
        const queryStrings = query[this.groupingString] || [];
        if (!_.isArray(queryStrings)) {
            queryArray = [queryStrings];
        } else {
            queryArray = queryStrings;
        }

        return queryArray;
    }
}

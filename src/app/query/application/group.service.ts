import { injectable } from 'inversify';
import * as _ from 'lodash';
import { GroupService } from '../model/group.model';
import { GroupAttributes } from '../model/shared.model';

@injectable()
export class DefaultGroupService implements GroupService {
    private static GROUPING_STRING = 'group-by';
    getGroupAttribute(
        query: Record<string, string | string[]>
    ): GroupAttributes {
        const queryStrings = query[DefaultGroupService.GROUPING_STRING];
        if (_.isNil(queryStrings)) return [];
        if (!_.isArray(queryStrings)) {
            return [queryStrings];
        }
        return queryStrings;
    }
}

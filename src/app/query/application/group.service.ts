import { injectable } from 'inversify';
import * as _ from 'lodash';
import { GroupService } from '../model/group.model';
import { GroupAttributes } from '../model/shared.model';

@injectable()
export class DefaultGroupService implements GroupService {
    getGroupAttribute(
        query: Record<string, string | string[]>
    ): GroupAttributes {
        return _.chain(query)
            .pick(['row', 'column'])
            .reduce((result, value: string, key) => {
                result.push(value);
                return result;
            }, [] as string[])
            .value() as GroupAttributes;
    }
}

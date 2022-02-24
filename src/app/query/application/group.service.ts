import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { APPLICATION_TYPES } from '../../application.types';
import { FilterConfigurationProvider } from '../model/filter.model';
import { GroupService } from '../model/group.model';
import { GroupAttributes } from '../model/shared.model';

@injectable()
export class DefaultGroupService implements GroupService {
    constructor(
        @inject(APPLICATION_TYPES.FilterConfigurationProvider)
        private filterConfigurationProvider: FilterConfigurationProvider,
        @inject(APPLICATION_TYPES.GroupingString)
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

        const result = queryArray.map((r) => {
            const definition =
                this.filterConfigurationProvider.findDefinitionById(r);
            if (_.isNull(definition)) {
                return r;
            }
            return definition.attribute;
        });
        return result;
    }
}

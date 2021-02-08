import { APPLICATION_TYPES } from './../../application.types';
import { FilterService } from './../model/filter.model';
import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { GroupService } from '../model/group.model';
import { GroupAttributes } from '../model/shared.model';

@injectable()
export class DefaultGroupService implements GroupService {
    constructor(
        @inject(APPLICATION_TYPES.FilterService)
        private filterService: FilterService
    ) {}

    getGroupAttribute(
        query: Record<string, string | string[]>
    ): GroupAttributes {
        return _.chain(query)
            .pick(['row', 'column'])
            .reduce((result, value: string, key) => {
                if (this.filterService.filterNamesToAttributes[value]) {
                    result.push(
                        this.filterService.filterNamesToAttributes[value]
                    );
                }
                return result;
            }, [] as string[])
            .value() as GroupAttributes;
    }
}

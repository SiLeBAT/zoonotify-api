import { GroupAttributes, QueryParameters } from './shared.model';

export interface GroupPort {
    getGroupAttribute(query: QueryParameters): GroupAttributes;
}

export interface GroupService extends GroupPort {}

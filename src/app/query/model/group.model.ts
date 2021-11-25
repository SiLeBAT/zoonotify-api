import { GroupAttributes, QueryParameters } from './shared.model';

export interface GroupPort {
    getGroupAttribute(query: QueryParameters): GroupAttributes;
}

export type GroupService = GroupPort;

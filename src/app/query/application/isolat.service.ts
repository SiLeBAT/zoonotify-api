import { inject, injectable } from 'inversify';
import {
    IsolateViewGateway,
    IsolateCollection,
    Isolate,
    IsolateResistanceSet,
} from '../domain/isolate.model';
import { Resistance, ResistanceViewGateway } from '../domain/resistance.model';
import { APPLICATION_TYPES } from '../../application.types';
import { IsolateQueryFilter } from '../domain/filter.model';

export interface IsolatePort {
    getIsolateById(bfrId: string): Promise<IsolateCollection>;
    getIsolateListByIsolateQueryFilter(
        filter: IsolateQueryFilter
    ): Promise<IsolateCollection>;
}

export type IsolateService = IsolatePort;

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private isolateGateway: IsolateViewGateway,
        @inject(APPLICATION_TYPES.ResistanceViewGateway)
        private resistanceGateway: ResistanceViewGateway
    ) {}

    async getIsolateById(bfrId: string): Promise<IsolateCollection> {
        const isolateList = await this.isolateGateway.find([
            ['bfrId', '=', bfrId],
        ]);
        // reload resitances via the previously completed isolateIdList
        const isolateIdList = isolateList.map((iso) => iso.isolateId);
        const resistanceFilter: any = [['isolateId', 'IN', isolateIdList]];
        const vResistanceList = await this.resistanceGateway.find(
            resistanceFilter
        );
        const isolateCollection = this.createIsolateCollection(
            vResistanceList,
            isolateList
        );
        return isolateCollection;
    }

    async getIsolateListByIsolateQueryFilter(
        filter: IsolateQueryFilter
    ): Promise<IsolateCollection> {
        const isolateFilter: any[] = filter.isolateFilter;
        let resistanceFilter: any[] = filter.resistanceFilter;
        let hasORCondition: boolean = filter.hasORCondition;

        let isolateIdList: number[] = [];
        let vResistanceList: Resistance[] = [];
        const hasIsolateFilter: boolean = isolateFilter.length > 0;
        const hasResistanceFilter: boolean = resistanceFilter.length > 0;
        const isCombinedSearch = hasResistanceFilter && hasIsolateFilter;
        if (hasResistanceFilter) {
            vResistanceList = await this.resistanceGateway.find(
                resistanceFilter
            );
            // retrieve distinct set of isolateIds from loaded resistances
            isolateIdList = [
                ...new Set(vResistanceList.map((r) => r.isolateId)),
            ];
            hasORCondition = hasORCondition && isolateIdList.length > 0;
            if (isCombinedSearch) {
                if (hasORCondition) {
                    // OR includes isolates referenced from loaded resistances
                    isolateFilter.unshift('OR');
                } else {
                    // AND
                    // excludes isolates not contained in loaded resistances
                    // excludes resistances not contained in loaded isolates
                    isolateFilter.unshift('AND');
                }
            }
            // add to isolate filter
            isolateFilter.push(['isolateId', 'IN', isolateIdList]);
        }
        // load isolates
        const isolateList = await this.isolateGateway.find(isolateFilter);
        // load resitances
        isolateIdList = isolateList.map((iso) => iso.isolateId);
        resistanceFilter = [['isolateId', 'IN', isolateIdList]];
        vResistanceList = await this.resistanceGateway.find(resistanceFilter);
        // create result
        return this.createIsolateCollection(vResistanceList, isolateList);
    }

    private createIsolateCollection(
        resistanceList: Resistance[],
        isolateList: Isolate[]
    ): IsolateCollection {
        this.validateCreateIsolateCollection(resistanceList, isolateList);

        const resultList: Isolate[] = [];
        isolateList.forEach((isolate) => {
            const loadedResistanceList: Resistance[] = resistanceList.filter(
                (r) => isolate.isolateId === r.isolateId
            );
            const resistanceSet: IsolateResistanceSet = {};
            loadedResistanceList.forEach((resistance) => {
                resistanceSet[resistance.name] = {
                    value: resistance.resistanceValue,
                    active: resistance.active,
                };
            });
            isolate.resistance = resistanceSet;
            resultList.push(isolate);
        });
        return { isolates: resultList };
    }

    private validateCreateIsolateCollection(
        resistanceList: Resistance[],
        isolateList: Isolate[]
    ) {
        const resistanceIsolateIdList = [
            ...new Set(resistanceList.map((r) => r.isolateId)),
        ];
        const isolateIdList = [
            ...new Set(isolateList.map((iso) => iso.isolateId)),
        ];
        const notContainedInIsolateIdList = resistanceIsolateIdList.filter(
            (x) => !isolateIdList.includes(x)
        );
        const notContainedInResistanceIsolateIdList = isolateIdList.filter(
            (x) => !resistanceIsolateIdList.includes(x)
        );
        if (notContainedInIsolateIdList.length > 0) {
            throw new Error(
                'error: provided isolates do not match the provided resistances'
            );
        }
        if (notContainedInResistanceIsolateIdList.length > 0) {
            // maybe valid: having isolates without corresponding resistence ?
        }
    }
}

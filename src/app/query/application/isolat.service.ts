import { inject, injectable } from 'inversify';
import {
    IsolateViewGateway,
    Isolate,
    IsolateResistanceSet,
} from '../domain/isolate.model';
import { Resistance, ResistanceViewGateway } from '../domain/resistance.model';
import { APPLICATION_TYPES } from '../../application.types';
import { IsolateQueryFilter } from '../domain/filter.model';
import { validate as uuidValidate } from 'uuid';
import * as _ from 'lodash';

export interface IsolatePort {
    getIsolateById(bfrId: string): Promise<Isolate[]>;
    getIsolateListByIsolateQueryFilter(
        filter: IsolateQueryFilter
    ): Promise<Isolate[]>;
}

export type IsolateService = IsolatePort;

@injectable()
export class DefaultIsolateService implements IsolateService {
    constructor(
        @inject(APPLICATION_TYPES.IsolateViewGateway)
        private vIsolateGateway: IsolateViewGateway,
        @inject(APPLICATION_TYPES.ResistanceViewGateway)
        private vResistanceGateway: ResistanceViewGateway
    ) {}

    async getIsolateById(bfrId: string): Promise<Isolate[]> {
        this.validateGetIsolateById(bfrId);
        // load isolates
        const idFilter: [[string, string, string]] = [
            ['bfrId', '=', bfrId.trim()],
        ];
        const vIsolateList = await this.vIsolateGateway.find(idFilter);
        // load the corresponding resitances for the loaded isolates
        const isolateIdList = vIsolateList.map((iso) => iso.isolateId);
        const resistanceFilter: any = [['isolateId', 'IN', isolateIdList]];
        const vResistanceList = await this.vResistanceGateway.find(
            resistanceFilter
        );
        return this.createIsolateList(vResistanceList, vIsolateList);
    }

    validateGetIsolateById(bfrId: string) {
        if (_.isUndefined(bfrId)) {
            throw Error('error: bfrId is undefined.');
        }
        if (_.isString(bfrId) && _.isEmpty(bfrId.trim())) {
            throw Error('error: bfrId is empty');
        }
        //regex test: /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
        if (!uuidValidate(bfrId.trim())) {
            throw Error('error: bfrId is not a valid uuid.');
        }
    }

    async getIsolateListByIsolateQueryFilter(
        filter: IsolateQueryFilter
    ): Promise<Isolate[]> {
        let isolateIdList: number[] = [];
        let vResistanceList: Resistance[] = [];
        let resistanceFilter: any[] = filter.resistanceFilter;
        let hasORCondition: boolean = filter.hasORCondition;
        const isolateFilter: any[] = filter.isolateFilter;

        const hasIsolateFilter: boolean = isolateFilter.length > 0;
        const hasResistanceFilter: boolean = resistanceFilter.length > 0;
        const isCombinedSearch = hasResistanceFilter && hasIsolateFilter;
        if (hasResistanceFilter) {
            vResistanceList = await this.vResistanceGateway.find(
                resistanceFilter
            );
            // distinct set of isolateIds from loaded resistances
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
                    // excludes isolates not corresponding to loaded resistances
                    // excludes resistances not corresponding to loaded isolates
                    isolateFilter.unshift('AND');
                }
            }
            // add to isolate filter
            isolateFilter.push(['isolateId', 'IN', isolateIdList]);
        }
        // load isolates
        const vIsolateList = await this.vIsolateGateway.find(isolateFilter);
        // load corresponding resistances
        isolateIdList = vIsolateList.map((iso) => iso.isolateId);
        resistanceFilter = [['isolateId', 'IN', isolateIdList]];
        vResistanceList = await this.vResistanceGateway.find(resistanceFilter);
        // create result
        return this.createIsolateList(vResistanceList, vIsolateList);
    }

    private createIsolateList(
        resistanceList: Resistance[],
        isolateList: Isolate[]
    ): Isolate[] {
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
        return resultList;
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

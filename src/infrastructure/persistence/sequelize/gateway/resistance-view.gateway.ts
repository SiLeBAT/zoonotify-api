import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { ResistanceViewModel } from '../dao/resistance-view.model';
import { ResistanceViewGateway, Resistance } from '../../../../app/ports';
import { createWherePart, ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { logger } from '../../../../aspects';

@injectable()
export class SequelizeResistanceViewGateway implements ResistanceViewGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.ResistanceViewModel)
        private ResistanceView: ModelStatic<ResistanceViewModel>
    ) {}

    find(queryFilter: string[]): Promise<Resistance[]> {
        logger.trace(`${this.constructor.name}.${this.find.name}, Executing`);

        let options = {};
        const whereClause: any = createWherePart(queryFilter);
        options = { ...options, ...whereClause };

        return this.ResistanceView.findAll(options)
            .then((vResistenceList) =>
                this.convertToResistanceCollection(vResistenceList)
            )
            .catch((e) => {
                throw this.handleException(e);
            });
    }

    private convertToResistanceCollection(
        vResistenceList: ResistanceViewModel[]
    ): Resistance[] {
        const resistanceList: Resistance[] = [];
        vResistenceList.forEach((vResistance) => {
            const resistance = new Resistance(
                vResistance.isolateId,
                vResistance.bfrId,
                vResistance.name,
                vResistance.resistanceValue,
                vResistance.active
            );
            resistanceList.push(resistance);
        });
        return resistanceList;
    }

    private handleException(error: any): void {
        throw new Error('Method not implemented.');
    }
}

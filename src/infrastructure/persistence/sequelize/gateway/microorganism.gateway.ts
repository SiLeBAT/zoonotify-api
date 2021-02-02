import { inject, injectable } from 'inversify';
import { MicroorganismGateway, Microorganism } from 'src/app/ports';
import { logger } from './../../../../aspects';
import { MicroorganismModel } from '../dao/microorganism.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';

@injectable()
export class SequelizeMicroorganismGateway implements MicroorganismGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.MicroorganismModel)
        private Microorganism: ModelStatic<MicroorganismModel>
    ) {}

    findAll(): Promise<Microorganism[]> {
        logger.trace(
            `${this.constructor.name}.${this.findAll.name}, Executing`
        );
        return this.Microorganism.findAll()
            .then(model => model.map(m => this.toEntity(m)))
            .catch(error => {
                logger.error(error);
                throw error;
            });
    }

    private toEntity(model: MicroorganismModel): Microorganism {
        logger.trace(
            `${this.constructor.name}.${this.toEntity.name}, Executing`
        );
        return {
            name: model.name
        };
    }
}

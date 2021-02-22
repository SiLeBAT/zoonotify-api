import { inject, injectable } from 'inversify';
import { ProgramModel } from '../dao/program.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { Program, ProgramGateway } from '../../../../app/ports';

@injectable()
export class SequelizeProgramGateway implements ProgramGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.ProgramModel)
        private Program: ModelStatic<ProgramModel>
    ) {}

    findAll(): Promise<Program[]> {
        return this.Program.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: ProgramModel): Program {
        return {
            samplingYear: model.samplingYear
        };
    }
}

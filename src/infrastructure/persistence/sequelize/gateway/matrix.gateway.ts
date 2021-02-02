import { inject, injectable } from 'inversify';
import { MatrixModel } from '../dao/matrix.model';
import { ModelStatic } from '../dao/shared.model';
import { PERSISTENCE_TYPES } from '../persistence.types';
import { Matrix, MatrixGateway } from '../../../../app/ports';

@injectable()
export class SequelizeMatrixGateway implements MatrixGateway {
    constructor(
        @inject(PERSISTENCE_TYPES.MatrixModel)
        private Matrix: ModelStatic<MatrixModel>
    ) {}

    findAll(): Promise<Matrix[]> {
        return this.Matrix.findAll().then(model =>
            model.map(m => this.toEntity(m))
        );
    }

    private toEntity(model: MatrixModel): Matrix {
        return {
            name: model.name
        };
    }
}

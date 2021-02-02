import { MatrixDetailModel } from './matrix-detail.model';
import { MatrixModel } from './matrix.model';
import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface CompleteMatrixAttributes {
    id: number;
    toMatrix: MatrixModel;
    toMatrixDetail: MatrixDetailModel;
}

export interface CompleteMatrixModel
    extends Model<CompleteMatrixAttributes>,
        CompleteMatrixAttributes {}

export class CompleteMatrixDAO extends Model<
    CompleteMatrixModel,
    CompleteMatrixAttributes
> {}

export function completeMatrixModelFactory(
    sequelize: Sequelize
): ModelStatic<CompleteMatrixModel> {
    return sequelize.define(
        'completeMatrices',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            matrixdetail: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'matrixDetails'
                }
            },
            matrix: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'matrices'
                }
            }
        },
        {
            tableName: 'matrix_komplet',
            timestamps: false
        }
    );
}

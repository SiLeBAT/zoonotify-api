import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface MatrixDetailAttributes {
    id: number;
    name: string;
}

export interface MatrixDetailModel
    extends Model<MatrixDetailAttributes>,
        MatrixDetailAttributes {}

export class MatrixDetailDAO extends Model<
    MatrixDetailModel,
    MatrixDetailAttributes
> {}

export function matrixDetailModelFactory(
    sequelize: Sequelize
): ModelStatic<MatrixDetailModel> {
    return sequelize.define(
        'matrixDetail',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'matrixdetail',
            timestamps: false
        }
    );
}

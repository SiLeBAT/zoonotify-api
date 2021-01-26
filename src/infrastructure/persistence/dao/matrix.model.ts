import { OriginModel } from './origin.model';
import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface MatrixAttributes {
    id: number;
    name: string;
    toOrigin: OriginModel;
}

export interface MatrixModel
    extends Model<MatrixAttributes>,
        MatrixAttributes {}

export class MatrixDAO extends Model<MatrixModel, MatrixAttributes> {}

export function matrixModelFactory(
    sequelize: Sequelize
): ModelStatic<MatrixModel> {
    return sequelize.define(
        'matrices',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            probenherkunft: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'origins',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'matrix',
            timestamps: false
        }
    );
}

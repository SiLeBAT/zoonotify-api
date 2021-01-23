import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface MicroorganismAttributes {
    id: number;
    name: string;
}

export interface MicroorganismModel
    extends Model<MicroorganismAttributes>,
        MicroorganismAttributes {}

export class MicroorganismDAO extends Model<
    MicroorganismModel,
    MicroorganismAttributes
> {}

export function microorganismModelFactory(
    sequelize: Sequelize
): ModelStatic<MicroorganismModel> {
    return sequelize.define(
        'microorganisms',
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
            tableName: 'erreger',
            timestamps: false
        }
    );
}

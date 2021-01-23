import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface OriginAttributes {
    id: number;
    name: string;
}

export interface OriginModel
    extends Model<OriginAttributes>,
        OriginAttributes {}

export class OriginDAO extends Model<OriginModel, OriginAttributes> {}

export function originModelFactory(
    sequelize: Sequelize
): ModelStatic<OriginModel> {
    return sequelize.define(
        'origins',
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
            tableName: 'probenherkunft',
            timestamps: false
        }
    );
}

import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface CharacteristicAttributes {
    id: number;
    name: string;
}

export interface CharacteristicModel
    extends Model<CharacteristicAttributes>,
        CharacteristicAttributes {}

export class CharacteristicDAO extends Model<
    CharacteristicModel,
    CharacteristicAttributes
> {}

export function characteristicModelFactory(
    sequelize: Sequelize
): ModelStatic<CharacteristicModel> {
    return sequelize.define(
        'characteristics',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'merkmal',
            timestamps: false
        }
    );
}

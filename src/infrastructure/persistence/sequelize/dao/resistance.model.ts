import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface ResistanceAttributes {
    id: number;
    name: string;
}

export interface ResistanceModel
    extends Model<ResistanceAttributes>,
        ResistanceAttributes {}

export class ResistanceDAO extends Model<
    ResistanceModel,
    ResistanceAttributes
> {}

export function resistanceModelFactory(
    sequelize: Sequelize
): ModelStatic<ResistanceModel> {
    return sequelize.define(
        'resistances',
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
            tableName: 'resistenz',
            timestamps: false
        }
    );
}

import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface FederalStateAttributes {
    id: number;
    abkuerzung: string;
    name: string;
}

export interface FederalStateModel
    extends Model<FederalStateAttributes>,
        FederalStateAttributes {}

export class FederalStateDAO extends Model<
    FederalStateModel,
    FederalStateAttributes
> {}

export function federalStateModelFactory(
    sequelize: Sequelize
): ModelStatic<FederalStateModel> {
    return sequelize.define(
        'federalStates',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                unique: true
            },
            abkuerzung: {
                type: DataTypes.STRING,
                unique: true
            }
        },
        {
            tableName: 'bundesland',
            timestamps: false
        }
    );
}

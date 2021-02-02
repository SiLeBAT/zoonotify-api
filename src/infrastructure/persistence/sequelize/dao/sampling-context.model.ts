import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SamplingContextAttributes {
    id: number;
    name: string;
}

export interface SamplingContextModel
    extends Model<SamplingContextAttributes>,
        SamplingContextAttributes {}

export class SamplingContextDAO extends Model<
    SamplingContextModel,
    SamplingContextAttributes
> {}

export function samplingContextModelFactory(
    sequelize: Sequelize
): ModelStatic<SamplingContextModel> {
    return sequelize.define(
        'samplingContexts',
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
            tableName: 'probenahmegrund',
            timestamps: false
        }
    );
}

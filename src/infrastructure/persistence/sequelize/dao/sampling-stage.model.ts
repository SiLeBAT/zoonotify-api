import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SamplingStageAttributes {
    id: number;
    name: string;
}

export interface SamplingStageModel
    extends Model<SamplingStageAttributes>,
        SamplingStageAttributes {}

export class SamplingStageDAO extends Model<
    SamplingStageModel,
    SamplingStageAttributes
> {}

export function samplingStageModelFactory(
    sequelize: Sequelize
): ModelStatic<SamplingStageModel> {
    return sequelize.define(
        'samplingStages',
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
            tableName: 'probenahmestelle',
            timestamps: false
        }
    );
}

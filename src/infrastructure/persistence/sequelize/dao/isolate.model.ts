import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface IsolateAttributes {
    isolateId: number;
    microorganism: string;
    federalState: string;
    samplingYear: string;
    samplingContext: string;
    samplingStage: string;
    productionType: string;
    category: string;
    matrix: string;
    origin: string;
    matrixDetail: string;
    characteristic: string;
    characteristicValue: string;
    resistance: string;
    resistanceActive: boolean;
    resistanceValue: string;
}

export interface IsolateModel
    extends Model<IsolateAttributes>,
        IsolateAttributes {}

export class IsolateDAO extends Model<IsolateModel, IsolateAttributes> {}

export function isolateModelFactory(
    sequelize: Sequelize
): ModelStatic<IsolateModel> {
    return sequelize.define(
        'isolates',
        {
            isolateId: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: 'isolate_id'
            },
            microorganism: {
                type: DataTypes.STRING
            },
            federalState: {
                type: DataTypes.STRING,
                field: 'federal_state'
            },
            samplingYear: {
                type: DataTypes.STRING,
                field: 'sampling_year'
            },
            samplingContext: {
                type: DataTypes.STRING,
                field: 'sampling_context'
            },
            samplingStage: {
                type: DataTypes.STRING,
                field: 'sampling_stage'
            },
            productionType: {
                type: DataTypes.STRING,
                field: 'production_type'
            },
            category: {
                type: DataTypes.STRING
            },
            matrix: {
                type: DataTypes.STRING
            },
            origin: {
                type: DataTypes.STRING
            },
            matrixDetail: {
                type: DataTypes.STRING,
                field: 'matrix_detail'
            },
            characteristic: {
                type: DataTypes.STRING
            },
            characteristicValue: {
                type: DataTypes.STRING,
                field: 'characteristic_value'
            },
            resistance: {
                type: DataTypes.STRING
            },
            resistanceActive: {
                type: DataTypes.BOOLEAN,
                field: 'resistance_active'
            },
            resistanceValue: {
                type: DataTypes.STRING,
                field: 'resistance_value'
            }
        },
        {
            tableName: 'v_isolat',
            timestamps: false
        }
    );
}

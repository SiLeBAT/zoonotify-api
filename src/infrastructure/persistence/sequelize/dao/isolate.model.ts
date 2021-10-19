import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';


// TODO: Are these needed? + orginaleinsendenummer (sourceID) + bfr_isolat_nr (bfrID)

export interface IsolateAttributes {
    isolateId: number;
    microorganism: string;
    federalState: string;
    samplingYear: string;
    matrixRichtung: string;
    samplingContext: string;
    isolatCharacteristic: string;
    isolatResistance: string;
    sourceID: string;
    bfrID: string;

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
            matrixRichtung: {
                type: DataTypes.STRING,
                field: 'matrix_richtung'
            },
            characteristic: {
                type: DataTypes.STRING,
                field: 'isolat_characteristic'
            },
            resistanceActive: {
                type: DataTypes.STRING,
                field: 'isolat_resistance'
            },
            sourceId: {
                type: DataTypes.STRING,
                field: 'orginaleinsendenummer'
            },
            bfrId: {
                type: DataTypes.STRING,
                field: 'bfr_isolat_nr'
            }
        },
        {
            tableName: 'isolat',
            timestamps: false
        }
    );
}

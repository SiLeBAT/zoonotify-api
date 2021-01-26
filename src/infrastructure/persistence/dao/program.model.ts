import { CompleteMatrixModel } from './complete-matrix.model';
import { ProductionTypeModel } from './production-type.model';
import { SamplingStageModel } from './sampling-stage.model';
import { SamplingContextModel } from './sampling-context.model';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface ProgramAttributes {
    id: number;
    samplingYear: string;
    toSamplingContext: SamplingContextModel;
    toSamplingStage: SamplingStageModel;
    toProductionType: ProductionTypeModel;
    toCompleteMatrix: CompleteMatrixModel;
}

export interface ProgramModel
    extends Model<ProgramAttributes>,
        ProgramAttributes {}

export class ProgramDAO extends Model<ProgramModel, ProgramAttributes> {}

export function programModelFactory(
    sequelize: Sequelize
): ModelStatic<ProgramModel> {
    return sequelize.define(
        'programs',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            samplingYear: {
                type: DataTypes.STRING,
                field: 'jahr'
            },
            probenahmegrund: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'samplingContexts',
                    key: 'id'
                }
            },
            probenahmeort: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'samplingStages',
                    key: 'id'
                }
            },
            produktionsrichtung: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'productionTypes',
                    key: 'id'
                }
            },
            matrix_komplet: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'completeMatrices',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'programm',
            timestamps: false
        }
    );
}

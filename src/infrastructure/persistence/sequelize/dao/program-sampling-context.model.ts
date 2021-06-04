import { SamplingContextModel } from './sampling-context.model';
import { ProgramModel } from './program.model';

import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface ProgramSamplingContextAttributes {
    id: number;
    toProgram: ProgramModel;
    toSamplingContext: SamplingContextModel;
}

export interface ProgramSamplingContextModel
    extends Model<ProgramSamplingContextAttributes>,
        ProgramSamplingContextAttributes {}

export class ProgramSamplingContextDAO extends Model<
    ProgramSamplingContextModel,
    ProgramSamplingContextAttributes
> {}

export function programSamplingContextModelFactory(
    sequelize: Sequelize
): ModelStatic<ProgramSamplingContextModel> {
    return sequelize.define(
        'programSamplingContext',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            program: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'programs',
                    key: 'id'
                }
            },
            samplingContext: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'samplingContexts',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'programm_probenahmegrund',
            timestamps: false
        }
    );
}

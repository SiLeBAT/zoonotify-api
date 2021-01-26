import { IsolateCharacteristicModel } from './isolate-characteristic.model';
import { ProgramModel } from './program.model';
import { FederalStateModel } from './federal-state.model';
import { MicroorganismModel } from './microorganism.model';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';
import { IsolateResistanceModel } from './isolate-resistance.model';

export interface IsolateAttributes {
    id: number;
    toMicroorganism: MicroorganismModel;
    toFederalState: FederalStateModel;
    toProgram: ProgramModel;
    toIsolateCharacteristics: IsolateCharacteristicModel[];
    toIsolateResistances: IsolateResistanceModel[];
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
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            erreger: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'microorganisms',
                    key: 'id'
                }
            },
            bundesland: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'federalStates',
                    key: 'id'
                }
            },
            programm: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'programs',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'isolat',
            timestamps: false
        }
    );
}

import { ResistanceModel } from './resistance.model';
import { IsolateViewModel } from './isolate-view.model';

import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface IsolateResistanceAttributes {
    id: number;
    toIsolate: IsolateViewModel;
    active: boolean;
    toResistance: ResistanceModel;
    value: string;
}

export interface IsolateResistanceModel
    extends Model<IsolateResistanceAttributes>,
        IsolateResistanceAttributes {}

export class IsolateResistanceDAO extends Model<
    IsolateResistanceModel,
    IsolateResistanceAttributes
> {}

export function isolateResistanceModelFactory(
    sequelize: Sequelize
): ModelStatic<IsolateResistanceModel> {
    return sequelize.define(
        'isolateResistances',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            isolat: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'isolates',
                    key: 'id'
                }
            },
            resistenz: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'resistances',
                    key: 'id'
                }
            },
            active: {
                type: DataTypes.BOOLEAN,
                field: 'aktiv'
            },
            value: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'isolat_resistenz',
            timestamps: false
        }
    );
}

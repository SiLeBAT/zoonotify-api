import { CharacteristicModel } from './characteristic.model';
import { IsolateViewModel } from './isolate-view.model';

import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface IsolateCharacteristicAttributes {
    id: number;
    toIsolate: IsolateViewModel;
    value: string;
    toCharacteristic: CharacteristicModel;
}

export interface IsolateCharacteristicModel
    extends Model<IsolateCharacteristicAttributes>,
        IsolateCharacteristicAttributes {}

export class IsolateCharacteristicDAO extends Model<
    IsolateCharacteristicModel,
    IsolateCharacteristicAttributes
> {}

export function isolateCharacteristicModelFactory(
    sequelize: Sequelize
): ModelStatic<IsolateCharacteristicModel> {
    return sequelize.define(
        'isolateCharacteristics',
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
            merkmal: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'characteristics',
                    key: 'id'
                }
            },
            value: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'isolat_merkmal',
            timestamps: false
        }
    );
}

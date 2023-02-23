import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelStatic } from './shared.model';

export interface ResistanceViewAttributes {
    isolateId: number;
    bfrId: string;
    name: string;
    active: boolean;
    resistanceValue: number;
}

export interface ResistanceViewModel
    extends Model<ResistanceViewAttributes>,
        ResistanceViewAttributes {}

export class VResistanceDao extends Model<
    ResistanceViewModel,
    ResistanceViewAttributes
> {}

export function resistanceViewModelFactory(
    sequelize: Sequelize
): ModelStatic<ResistanceViewModel> {
    const _resistanceViewModel: ModelStatic<ResistanceViewModel> =
        sequelize.define(
            'mvResistance',
            {
                isolateId: {
                    type: DataTypes.BIGINT,
                    field: 'isolate_id',
                },
                bfrId: {
                    type: DataTypes.STRING,
                    field: 'bfr_id',
                },
                name: {
                    type: DataTypes.STRING,
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    field: 'active',
                },
                resistanceValue: {
                    type: DataTypes.DECIMAL,
                    field: 'resistance_value',
                },
            },
            {
                tableName: 'mv_resistenz',
                timestamps: false,
            }
        );
    _resistanceViewModel.removeAttribute('id');
    return _resistanceViewModel;
}

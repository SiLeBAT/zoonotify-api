import _ = require('lodash');
import { DataTypes, Model, Sequelize } from 'sequelize';
import { CompareOperator, ModelStatic } from './shared.model';

export interface IsolateViewAttributes {
    isolateId: number;
    bfrId: string;
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
    clonalGroup: string;
    spaType: string;
    ampcCarbaPhenotype: string;
    spez: string;
    serovar: string;
    serotype: string;
    oGroup: string;
    hGroup: string;
    stx1: string;
    stx2: string;
    eae: string;
    e_hly: string;
    // resistance: string;
    // resistanceActive: boolean;
    // resistanceValue: string;
}

export interface IsolateViewModel
    extends Model<IsolateViewAttributes>,
        IsolateViewAttributes {}

export class IsolateViewDAO extends Model<
    IsolateViewModel,
    IsolateViewAttributes
> {}

export function isolateViewModelFactory(
    sequelize: Sequelize
): ModelStatic<IsolateViewModel> {
    const _isolateViewModel: ModelStatic<IsolateViewModel> = sequelize.define(
        'mvIsolate',
        {
            isolateId: {
                type: DataTypes.BIGINT,
                field: 'isolat_id',
            },
            bfrId: {
                type: DataTypes.STRING,
                field: 'bfr_id',
            },
            microorganism: {
                type: DataTypes.STRING,
            },
            federalState: {
                type: DataTypes.STRING,
                field: 'federal_state',
            },
            samplingYear: {
                type: DataTypes.STRING,
                field: 'sampling_year',
            },
            samplingContext: {
                type: DataTypes.STRING,
                field: 'sampling_context',
            },
            samplingStage: {
                type: DataTypes.STRING,
                field: 'sampling_stage',
            },
            productionType: {
                type: DataTypes.STRING,
                field: 'production_type',
            },
            category: {
                type: DataTypes.STRING,
            },
            matrix: {
                type: DataTypes.STRING,
            },
            origin: {
                type: DataTypes.STRING,
            },
            matrixDetail: {
                type: DataTypes.STRING,
                field: 'matrix_detail',
            },
            clonalGroup: {
                type: DataTypes.STRING,
                field: 'clonal_group',
            },
            spaType: {
                type: DataTypes.STRING,
                field: 'spa_type',
            },
            ampcCarbaPhenotype: {
                type: DataTypes.STRING,
                field: 'ampc_carba_phenotype',
            },
            spez: {
                type: DataTypes.STRING,
            },
            serovar: {
                type: DataTypes.STRING,
            },
            serotype: {
                type: DataTypes.STRING,
            },
            oGroup: {
                type: DataTypes.STRING,
                field: 'o_group',
            },
            hGroup: {
                type: DataTypes.STRING,
                field: 'h_group',
            },
            stx1: {
                type: DataTypes.STRING,
                field: 'stx1_gen',
            },
            stx2: {
                type: DataTypes.STRING,
                field: 'stx2_gen',
            },
            eae: {
                type: DataTypes.STRING,
                field: 'eae_gen',
            },
            e_hly: {
                type: DataTypes.STRING,
                field: 'e_hly_gen',
            },
        },
        {
            tableName: 'mv_isolat',
            timestamps: false,
        }
    );
    _isolateViewModel.removeAttribute('id');
    return _isolateViewModel;
}

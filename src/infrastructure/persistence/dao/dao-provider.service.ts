import { Database } from './../datastore/sequelize/databse.model';
import { injectable } from 'inversify';
import { ModelStatic, Sequelize } from 'sequelize/types';
import { categoryModelFactory } from './category.model';
import { characteristicModelFactory } from './characteristic.model';
import { completeMatrixModelFactory } from './complete-matrix.model';
import { federalStateModelFactory } from './federal-state.model';
import { isolateCharacteristicModelFactory } from './isolate-characteristic.model';
import { isolateResistanceModelFactory } from './isolate-resistance.model';
import { isolateModelFactory } from './isolate.model';
import { matrixDetailModelFactory } from './matrix-detail.model';
import { matrixModelFactory } from './matrix.model';
import { microorganismModelFactory } from './microorganism.model';
import { originModelFactory } from './origin.model';
import { productionTypeModelFactory } from './production-type.model';
import { programModelFactory } from './program.model';
import { resistanceModelFactory } from './resistance.model';
import { samplingContextModelFactory } from './sampling-context.model';
import { samplingStageModelFactory } from './sampling-stage.model';

// tslint:disable-next-line:no-any
export type DAOHash = Record<string, ModelStatic<any>>;

export interface DAOProvider {
    getDAOHash(): DAOHash;
}

@injectable()
export class SequelizeDAOProvider implements DAOProvider {
    private daoHash: DAOHash;
    constructor(private db: Database<Sequelize>) {
        this.daoHash = this.createDAOS();
    }

    getDAOHash() {
        return this.daoHash;
    }
    private createDAOS() {
        const Microorganism = microorganismModelFactory(this.db.getDatastore());
        const Matrix = matrixModelFactory(this.db.getDatastore());
        const SamplingContext = samplingContextModelFactory(
            this.db.getDatastore()
        );
        const Isolate = isolateModelFactory(this.db.getDatastore());
        const FederalState = federalStateModelFactory(this.db.getDatastore());
        const Program = programModelFactory(this.db.getDatastore());
        const SamplingStage = samplingStageModelFactory(this.db.getDatastore());
        const ProductionType = productionTypeModelFactory(
            this.db.getDatastore()
        );
        const Category = categoryModelFactory(this.db.getDatastore());
        const CompleteMatrix = completeMatrixModelFactory(
            this.db.getDatastore()
        );
        const MatrixDetail = matrixDetailModelFactory(this.db.getDatastore());
        const Origin = originModelFactory(this.db.getDatastore());
        const IsolateCharacteristic = isolateCharacteristicModelFactory(
            this.db.getDatastore()
        );
        const Characteristic = characteristicModelFactory(
            this.db.getDatastore()
        );
        const IsolateResistance = isolateResistanceModelFactory(
            this.db.getDatastore()
        );
        const Resistance = resistanceModelFactory(this.db.getDatastore());

        Isolate.belongsTo(Microorganism, {
            foreignKey: 'erreger',
            as: 'toMicroorganism'
        });

        Microorganism.hasMany(Isolate, {
            foreignKey: 'erreger',
            as: 'toIsolates'
        });

        Isolate.belongsTo(FederalState, {
            foreignKey: 'bundesland',
            as: 'toFederalState'
        });

        FederalState.hasMany(Isolate, {
            foreignKey: 'bundesland',
            as: 'toIsolates'
        });

        Isolate.belongsTo(Program, {
            foreignKey: 'programm',
            as: 'toProgram'
        });

        Program.hasMany(Isolate, {
            foreignKey: 'programm',
            as: 'toIsolates'
        });

        Program.belongsTo(SamplingContext, {
            foreignKey: 'probenahmegrund',
            as: 'toSamplingContext'
        });

        SamplingContext.hasMany(Program, {
            foreignKey: 'probenahmegrund',
            as: 'toPrograms'
        });

        Program.belongsTo(SamplingStage, {
            foreignKey: 'probenahmeort',
            as: 'toSamplingStage'
        });

        SamplingStage.hasMany(Program, {
            foreignKey: 'probenahmeort',
            as: 'toPrograms'
        });

        Program.belongsTo(ProductionType, {
            foreignKey: 'produktionsrichtung',
            as: 'toProductionType'
        });

        ProductionType.hasMany(Program, {
            foreignKey: 'produktionsrichtung',
            as: 'toPrograms'
        });

        Program.belongsTo(CompleteMatrix, {
            foreignKey: 'matrix_komplet',
            as: 'toCompleteMatrix'
        });

        CompleteMatrix.hasMany(Program, {
            foreignKey: 'matrix_komplet',
            as: 'toPrograms'
        });

        ProductionType.belongsTo(Category, {
            foreignKey: 'oberkategorie',
            as: 'toCategory'
        });

        Category.hasMany(ProductionType, {
            foreignKey: 'oberkategorie',
            as: 'toProductionTypes'
        });

        CompleteMatrix.belongsTo(Matrix, {
            foreignKey: 'matrix',
            as: 'toMatrix'
        });

        Matrix.hasMany(CompleteMatrix, {
            foreignKey: 'matrix',
            as: 'toCompleteMatrices'
        });

        CompleteMatrix.belongsTo(MatrixDetail, {
            foreignKey: 'matrixdetail',
            as: 'toMatrixDetail'
        });

        MatrixDetail.hasMany(CompleteMatrix, {
            foreignKey: 'matrixdetail',
            as: 'toCompleteMatrices'
        });

        Matrix.belongsTo(Origin, {
            foreignKey: 'probenherkunft',
            as: 'toOrigin'
        });

        Origin.hasMany(Matrix, {
            foreignKey: 'probenherkunft',
            as: 'toMatrices'
        });

        IsolateCharacteristic.belongsTo(Isolate, {
            foreignKey: 'isolat',
            as: 'toIsolate'
        });

        Isolate.hasMany(IsolateCharacteristic, {
            foreignKey: 'isolat',
            as: 'toIsolateCharacteristics'
        });

        IsolateCharacteristic.belongsTo(Characteristic, {
            foreignKey: 'merkmal',
            as: 'toCharacteristic'
        });

        Characteristic.hasMany(IsolateCharacteristic, {
            foreignKey: 'merkmal',
            as: 'toIsolateCharacteristics'
        });

        IsolateResistance.belongsTo(Isolate, {
            foreignKey: 'isolat',
            as: 'toIsolate'
        });

        Isolate.hasMany(IsolateResistance, {
            foreignKey: 'isolat',
            as: 'toIsolateResistances'
        });

        IsolateResistance.belongsTo(Resistance, {
            foreignKey: 'resistenz',
            as: 'toResistance'
        });

        Resistance.hasMany(IsolateResistance, {
            foreignKey: 'resistenz',
            as: 'toIsolateResistances'
        });

        return {
            microorganism: Microorganism,
            matrix: Matrix,
            samplingContext: SamplingContext,
            isolate: Isolate,
            federalState: FederalState,
            program: Program,
            samplingStage: SamplingStage,
            productionType: ProductionType,
            category: Category,
            completeMatrix: CompleteMatrix,
            matrixDetail: MatrixDetail,
            origin: Origin,
            isolateCharacteristic: IsolateCharacteristic,
            characteristic: Characteristic,
            isolateResistance: IsolateResistance,
            resistance: Resistance
        };
    }
}

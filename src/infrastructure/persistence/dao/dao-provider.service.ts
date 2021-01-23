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
    constructor(private db: Database<Sequelize>) {}

    getDAOHash() {
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
            foreignKey: 'erreger'
        });

        Microorganism.hasMany(Isolate, {
            foreignKey: 'erreger'
        });

        Isolate.belongsTo(FederalState, {
            foreignKey: 'bundesland'
        });

        FederalState.hasMany(Isolate, {
            foreignKey: 'bundesland'
        });

        Isolate.belongsTo(Program, {
            foreignKey: 'programm'
        });

        Program.hasMany(Isolate, {
            foreignKey: 'programm'
        });

        Program.belongsTo(SamplingContext, {
            foreignKey: 'probenahmegrund'
        });

        SamplingContext.hasMany(Program, {
            foreignKey: 'probenahmegrund'
        });

        Program.belongsTo(SamplingStage, {
            foreignKey: 'probenahmeort'
        });

        SamplingStage.hasMany(Program, {
            foreignKey: 'probenahmeort'
        });

        Program.belongsTo(ProductionType, {
            foreignKey: 'produktionsrichtung'
        });

        ProductionType.hasMany(Program, {
            foreignKey: 'produktionsrichtung'
        });

        Program.belongsTo(CompleteMatrix, {
            foreignKey: 'matrix_komplet'
        });

        CompleteMatrix.hasMany(Program, {
            foreignKey: 'matrix_komplet'
        });

        ProductionType.belongsTo(Category, {
            foreignKey: 'oberkategorie'
        });

        Category.hasMany(ProductionType, {
            foreignKey: 'oberkategorie'
        });

        CompleteMatrix.belongsTo(Matrix, {
            foreignKey: 'matrix',
            as: 'toMatrix'
        });

        Matrix.hasMany(CompleteMatrix, {
            foreignKey: 'matrix'
        });

        CompleteMatrix.belongsTo(MatrixDetail, {
            foreignKey: 'matrixdetail'
        });

        MatrixDetail.hasMany(CompleteMatrix, {
            foreignKey: 'matrixdetail'
        });

        Matrix.belongsTo(Origin, {
            foreignKey: 'probenherkunft'
        });

        Origin.hasMany(Matrix, {
            foreignKey: 'probenherkunft'
        });

        IsolateCharacteristic.belongsTo(Isolate, {
            foreignKey: 'isolat'
        });

        Isolate.hasMany(IsolateCharacteristic, {
            foreignKey: 'isolat'
        });

        IsolateCharacteristic.belongsTo(Characteristic, {
            foreignKey: 'merkmal'
        });

        Characteristic.hasMany(IsolateCharacteristic, {
            foreignKey: 'merkmal'
        });

        IsolateResistance.belongsTo(Isolate, {
            foreignKey: 'isolat'
        });

        Isolate.hasMany(IsolateResistance, {
            foreignKey: 'isolat'
        });

        IsolateResistance.belongsTo(Resistance, {
            foreignKey: 'resistenz'
        });

        Resistance.hasMany(IsolateResistance, {
            foreignKey: 'resistenz'
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

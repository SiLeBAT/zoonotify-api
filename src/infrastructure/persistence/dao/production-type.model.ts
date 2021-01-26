import { CategoryModel } from './category.model';
import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ProductionTypeAttributes {
    id: number;
    name: string;
    toCategory: CategoryModel;
}

export interface ProductionTypeModel
    extends Model<ProductionTypeAttributes>,
        ProductionTypeAttributes {}

export class ProductionTypeDAO extends Model<
    ProductionTypeModel,
    ProductionTypeAttributes
> {}

export function productionTypeModelFactory(
    sequelize: Sequelize
): ModelStatic<ProductionTypeModel> {
    return sequelize.define(
        'productionTypes',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            oberkategorie: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'categories',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'produktionsrichtung',
            timestamps: false
        }
    );
}

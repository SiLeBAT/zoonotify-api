import { ModelStatic } from './shared.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface CategoryAttributes {
    id: number;
    name: string;
}

export interface CategoryModel
    extends Model<CategoryAttributes>,
        CategoryAttributes {}

export class CategoryDAO extends Model<CategoryModel, CategoryAttributes> {}

export function categoryModelFactory(
    sequelize: Sequelize
): ModelStatic<CategoryModel> {
    return sequelize.define(
        'categories',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'oberkategorie',
            timestamps: false
        }
    );
}

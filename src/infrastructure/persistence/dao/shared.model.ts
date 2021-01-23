import { Model, BuildOptions } from 'sequelize';

export type ModelStatic<T> = typeof Model & {
    new (values?: object, options?: BuildOptions): T;
};

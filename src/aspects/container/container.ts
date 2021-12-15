import 'reflect-metadata';
import { Container } from 'inversify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getContainer(...args: any[]) {
    return new Container(...args);
}

import { v4 as uuid } from 'uuid';

export class TreeNode<T> {
    private _children: TreeNode<T>[] = [];
    private _key: string;
    private _value: T;
    private _parent: TreeNode<T> | null;

    constructor(value: T, parent: TreeNode<T> | null = null) {
        this._key = uuid();
        this._value = value;
        this._parent = parent;
    }

    get parent() {
        return this._parent;
    }
    get value() {
        return this._value;
    }

    get children() {
        return this._children;
    }

    get key() {
        return this._key;
    }

    get isLeaf() {
        return this._children.length === 0;
    }

    get hasChildren() {
        return !this.isLeaf;
    }

    clearChildren() {
        this._children = [];
    }
}

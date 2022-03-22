import { TreeNode } from './tree-node';

export class Tree<T> {
    private _root: TreeNode<T>;
    constructor(value: T) {
        this._root = new TreeNode(value);
    }

    getRoot(): TreeNode<T> {
        return this._root;
    }

    *preOrderTraversal(node = this._root): IterableIterator<TreeNode<T>> {
        yield node;
        if (node.children.length) {
            for (const child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    *postOrderTraversal(node = this._root): IterableIterator<TreeNode<T>> {
        if (node.children.length) {
            for (const child of node.children) {
                yield* this.postOrderTraversal(child);
            }
        }
        yield node;
    }

    insert(parentNodeKey: string, value: T): string {
        for (const node of this.preOrderTraversal()) {
            if (node.key === parentNodeKey) {
                const newNode = new TreeNode(value, node);
                node.children.push(newNode);
                return newNode.key;
            }
        }
        throw Error('Could not insert node into tree');
    }

    remove(key: string) {
        for (const node of this.preOrderTraversal()) {
            const filtered = node.children.filter(
                (c: TreeNode<T>) => c.key !== key
            );
            if (filtered.length !== node.children.length) {
                node.clearChildren();
                const parentId = node.key;
                filtered.forEach((n) => this.insert(parentId, n.value));
                return true;
            }
        }
        return false;
    }

    find(key: string): TreeNode<T> | undefined {
        for (const node of this.preOrderTraversal()) {
            if (node.key === key) return node;
        }
        return undefined;
    }
}

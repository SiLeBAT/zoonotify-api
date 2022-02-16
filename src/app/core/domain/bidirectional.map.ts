interface StringMap {
    [key: string]: string;
}

export class BidirectionalMap {
    fwdMap: StringMap = {};
    revMap: StringMap = {};

    constructor(map: StringMap) {
        this.fwdMap = { ...map };
        this.revMap = Object.keys(map).reduce(
            (acc, cur) => ({
                ...acc,
                [map[cur]]: cur,
            }),
            {}
        );
    }

    get(key: string): string | undefined {
        return this.fwdMap[key] || this.revMap[key];
    }

    add(pair: [string, string]) {
        this.fwdMap[pair[0]] = pair[1];
        this.revMap[pair[1]] = pair[0];
    }
}

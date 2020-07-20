
export type TokenizeType = {
    tolerant: boolean,
    comment: boolean,
    tokens: boolean,
    range: boolean,
    loc: boolean,
}

export type Token = {
    type: string,
    value: string,
    range?: Array<number>,
    loc?: object
}
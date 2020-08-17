import { TokenizeType, Token, OccurrencesType } from './types'
import { tokenize } from 'esprima'

export const defaults: TokenizeType = {
    tolerant: true,
    comment: true,
    tokens: true,
    range: true,
    loc: true,
}

export const getTokens = (str: string): Array<Token> => {
    return tokenize(str, Object.assign({}, defaults))
}

export const getComments = (tokens: Array<Token>) =>
    tokens.filter((element) => {
        if (isComment(element)) {
            return element
        }
    })

export const isComment = (token: Token) =>
    token.type === 'LineComment' || token.type === 'BlockComment'

export const isCommentEslintDisabled = (token: Token) =>
    token.value.includes('eslint-disable')

export const getDisabledEslint = (tokens: Array<Token>) =>
    tokens.filter((token) => {
        if (isCommentEslintDisabled(token)) {
            return token
        }
    })

export const getSortedList = (comments: Array<Token>) => comments.sort((a: Token, b: Token) => ((a.value as any) - (b.value as any)))

export const getListOfEslintStrings = (comments: Array<Token>) => {
    return comments.map(comment => comment.value.trim())
}
export const getListOfUniqueEslintDisabledComments = (comments: Array<string>) => {
    return comments.reduce((unique: Array<string>, item) =>
        unique.includes(item) ? unique : [...unique, item]
        , [])
}



export const getNumberOfOccurrences = (listOfEslintString: Array<string>) => {
    return listOfEslintString.reduce((acc: Array<OccurrencesType> | any, eslintRule) => {
        if (acc && acc.some((element: OccurrencesType) => element[eslintRule])) {
            acc = acc.map((el: OccurrencesType, index: number | string) => {
                if (el[eslintRule]) {
                    el[eslintRule] = el[eslintRule] + 1
                    return el
                } else {
                    return el
                }
            })
            return acc
        } else {
            let newRule: OccurrencesType = {}
            newRule[eslintRule] = Number(1)
            acc.push(newRule)
        }
        return acc
    }, [])
}

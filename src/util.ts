import { TokenizeType, Token, OccurrencesType } from './types'
import { tokenize } from 'esprima'

export const defaults: TokenizeType = {
    tolerant: true,
    comment: true,
    tokens: true,
    range: true,
    loc: true,
}

/**
 * Uses the tokenize method of esprima to get the tokens from the string
 * @param {string} str the input string
 * @return {Array<Token>} the tokens generated from the string
 */
export const getTokens = (str: string): Array<Token> => {
    return tokenize(str, Object.assign({}, defaults))
}


/**
 * Method filters the comments from the input tokens
 * @param {Array<Token>} tokens 
 * @return {Array<Token}
 */
export const getComments = (tokens: Array<Token>) =>
    tokens.filter((element) => {
        if (isComment(element)) {
            return element
        }
    })

/**
 * Method checks if the token is a comment
 * @param {Token} token  
 * @return {boolean}
 */
export const isComment = (token: Token) =>
    token.type === 'LineComment' || token.type === 'BlockComment'


/**
 * Method checks if the comment is eslint disable comment 
 * @param {Token} token 
 * @return {boolean}
 */
export const isCommentEslintDisabled = (token: Token) =>
    token.value.includes('eslint-disable')


/**
 * Method to filter the eslint disabled tokens 
 * @param {Array<Token>} tokens 
 * @return {Array<Token} 
 */
export const getDisabledEslint = (tokens: Array<Token>) =>
    tokens.filter((token) => {
        if (isCommentEslintDisabled(token)) {
            return token
        }
    })

/**
 * Method to get the sorted list of tokens 
 * @param {Array<Token>} comments 
 * @return {Array<Token}
 */
export const getSortedList = (comments: Array<Token>) => comments.sort((a: Token, b: Token) => ((a.value as any) - (b.value as any)))


/**
 * Method to get the list of eslint string 
 * @param {Array<Token>} comments 
 * @return {Array<Token}
 */
export const getListOfEslintStrings = (comments: Array<Token>) => {
    return comments.map(comment => comment.value.trim())
}


/**
 * Method to get the list of unique eslint disabled comments
 * @param {Array<Token>} comments 
 * @return {Array<Token}
 */
export const getListOfUniqueEslintDisabledComments = (comments: Array<string>) => {
    return comments.reduce((unique: Array<string>, item) =>
        unique.includes(item) ? unique : [...unique, item]
        , [])
}


/**
 * Method to get the number of occurences 
 * @param listOfEslintString 
 * @return {Array<OccurrencesType}
 */
export const getNumberOfOccurrences = (listOfEslintString: Array<string>) => {
    return listOfEslintString.reduce((listOfOccurrences: Array<OccurrencesType> | any, eslintRule) => {
        if (listOfOccurrences && listOfOccurrences.some((occurrence: OccurrencesType) => occurrence[eslintRule])) {
            listOfOccurrences = listOfOccurrences.map((occurrence: OccurrencesType, index: number | string) => {
                if (occurrence[eslintRule]) {
                    occurrence[eslintRule] = occurrence[eslintRule] + 1
                    return occurrence
                } else {
                    return occurrence
                }
            })
            return listOfOccurrences
        } else {
            let newRule: OccurrencesType = {}
            newRule[eslintRule] = Number(1)
            listOfOccurrences.push(newRule)
        }
        return listOfOccurrences
    }, [])
}

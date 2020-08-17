import { tokenize } from 'esprima'
import { TokenizeType, Token } from './types'
import fs from 'fs'

const defaults: TokenizeType = {
  tolerant: true,
  comment: true,
  tokens: true,
  range: true,
  loc: true,
}

const getTokens = (str: string): Array<Token> => {
  return tokenize(str, Object.assign({}, defaults))
}

const getComments = (tokens: Array<Token>) =>
  tokens.filter((element) => {
    if (isComment(element)) {
      return element
    }
  })

const isComment = (token: Token) =>
  token.type === 'LineComment' || token.type === 'BlockComment'

const isCommentEslintDisabled = (token: Token) =>
  token.value.includes('eslint-disable')

const getDisabledEslint = (tokens: Array<Token>) =>
  tokens.filter((token) => {
    if (isCommentEslintDisabled(token)) {
      return token
    }
  })

const getSortedList = (comments: Array<Token>) => comments.sort((a: Token, b: Token) => ((a.value as any) - (b.value as any)))

const getListOfEslintStrings = (comments: Array<Token>) => {
  return comments.map(comment => comment.value)
}
const extractDisabledEslint = (fileString: string) => {
  const tokens = getTokens(fileString)
  const comments = getComments(tokens)

  const listOfDisabledEslint = getDisabledEslint(comments)
  const sortedList = getSortedList(listOfDisabledEslint)
  const listOfEslintStrings = getListOfEslintStrings(sortedList)
  const listOfUniqueEslintStrings = getListOfUniqueEslintDisabledComments(listOfEslintStrings)
  console.log(listOfUniqueEslintStrings)
  return getDisabledEslint(comments)
}
const sampleFileString = fs.readFileSync('./sample.js', 'utf-8')

const getListOfUniqueEslintDisabledComments = (comments: Array<string>) => {
  return comments.reduce((unique: Array<string>, item) =>
    unique.includes(item) ? unique : [...unique, item]
    , [])
}

// extractDisabledEslint(sampleFileString)

export default extractDisabledEslint
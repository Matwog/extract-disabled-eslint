import { tokenize } from 'esprima'
import fs from 'fs'
import { TokenizeType, Token } from './types'


const sampleFileString = fs.readFileSync('sample.js', 'utf8')

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



const extractDisabledEslint = (fileString: string) => {
  const tokens = getTokens(fileString)
  const comments = getComments(tokens)

  return getDisabledEslint(comments)
}

console.log(extractDisabledEslint(sampleFileString))

export default extractDisabledEslint
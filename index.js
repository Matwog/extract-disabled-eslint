const esprima = require('esprima')
const fs = require('fs')

const mockString = fs.readFileSync('sample.js', 'utf8')
const defaults = {
  tolerant: true,
  comment: true,
  tokens: true,
  range: true,
  loc: true,
}

const getTokens = (str) => {
  return esprima.tokenize(str, Object.assign({}, defaults))
}

const extractComments = (tokens) =>
  tokens.filter((element) => {
    if (isComment(element)) {
      return element
    }
  })

const isComment = (token) =>
  token.type === 'LineComment' || token.type === 'BlockComment'

const isCommentEslintDisabled = (token) =>
  token.value.includes('eslint-disable')

const extractDisabledEslint = (tokens) =>
  tokens.filter((token) => {
    if (isCommentEslintDisabled(token)) {
      return token
    }
  })

const tokens = getTokens(mockString)
const comments = extractComments(tokens)

console.log(comments)
console.log(extractDisabledEslint(comments))

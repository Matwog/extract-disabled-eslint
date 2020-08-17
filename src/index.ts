import { tokenize } from 'esprima'
import fs from 'fs'
import { getTokens, getNumberOfOccurrences, getSortedList, isComment, isCommentEslintDisabled, getComments, getListOfEslintStrings, getDisabledEslint } from './util'

const extractDisabledEslint = (fileString: string) => {
  const tokens = getTokens(fileString)
  const comments = getComments(tokens)
  const listOfDisabledEslint = getDisabledEslint(comments)
  const sortedList = getSortedList(listOfDisabledEslint)
  const listOfEslintStrings = getListOfEslintStrings(sortedList)
  const numberOfOccurrences = getNumberOfOccurrences(listOfEslintStrings)

  return { listOfDisabledEslint: listOfDisabledEslint, numberOfOccurrences: numberOfOccurrences }
}


const sampleFileString = fs.readFileSync('./sample.js', 'utf-8')

const { listOfDisabledEslint, numberOfOccurrences } = extractDisabledEslint(sampleFileString)
console.log(numberOfOccurrences)
export default extractDisabledEslint

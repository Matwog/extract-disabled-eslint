import { tokenize } from 'esprima'
import fs from 'fs'
import { getTokens, getNumberOfOccurrences, getSortedList, isComment, isCommentEslintDisabled, getComments, getListOfEslintStrings, getDisabledEslint } from './util'
import { DisabledEslintRules} from './types'

/**
 * Method to extract the disabled eslint rules from the input file string
 * @param {string} fileString 
 * @return  {DisabledEslintRules}
 */
const extractDisabledEslint = (fileString: string): DisabledEslintRules => {
  const tokens = getTokens(fileString)
  const comments = getComments(tokens)
  const listOfDisabledEslint = getDisabledEslint(comments)
  const sortedList = getSortedList(listOfDisabledEslint)
  const listOfEslintStrings = getListOfEslintStrings(sortedList)
  const numberOfOccurrences = getNumberOfOccurrences(listOfEslintStrings)

  return { listOfDisabledEslint: listOfDisabledEslint, numberOfOccurrences: numberOfOccurrences }
}

export default extractDisabledEslint

/**
 * An example to check how extractDisabledEslint works uncomment the following lines and yarn run start
 */

/**
  const sampleFileString = fs.readFileSync('./sample.js', 'utf-8')

  const { listOfDisabledEslint, numberOfOccurrences } = extractDisabledEslint(sampleFileString)
  console.log(listOfDisabledEslint, numberOfOccurrences)
 */

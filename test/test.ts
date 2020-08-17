import extractDisabledEslint from '../src/index'
import fs from 'fs'

describe('extractDisabledEslint', () => {
    const sampleFileString = fs.readFileSync('./test/testSample.js', 'utf8')
    it('Should return the disabled eslint rules', () => {
        const [expectedDisabledEslintRules] = [
            {
                type: 'BlockComment',
                value: ' eslint-disable react/forbid-prop-types ',
            },
            {
                type: 'LineComment',
                value: ' eslint-disable-next-line ',
            }
        ]

        const { listOfDisabledEslint } = extractDisabledEslint(sampleFileString)

        expect(listOfDisabledEslint).toEqual(expect.arrayContaining([
            expect.objectContaining(expectedDisabledEslintRules)
        ]))
    })
})

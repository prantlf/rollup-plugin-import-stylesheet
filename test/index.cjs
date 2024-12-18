const { strictEqual } = require('node:assert')
const test = require('tehanu')(__filename)
const { importStylesheet } = require('rollup-plugin-import-stylesheet')

test('exports', () => {
  strictEqual(typeof importStylesheet, 'function')
})

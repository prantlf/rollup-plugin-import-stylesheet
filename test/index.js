import { fail, strictEqual } from 'node:assert'
import { fileURLToPath } from 'node:url'
import { rollup } from 'rollup'
import tehanu from 'tehanu'
import { importStylesheet } from '../lib/index.js'

const test = tehanu(fileURLToPath(import.meta.url))

test('does not minify by default', async () => {
  const bundle = await rollup({
    input: 'test/flex-body.css',
    plugins: [importStylesheet()]
  })
  const { output } = await bundle.generate({});
  const { code } = output[0]
  strictEqual(code, `const stylesheet = new CSSStyleSheet();

stylesheet.replace(\`.control { display: flex }
body { display: flex }
\`);

export { stylesheet as default };
`)
})

test('minifies', async () => {
  const bundle = await rollup({
    input: 'test/controls.css',
    plugins: [importStylesheet({ minify: true })]
  })
  const { output } = await bundle.generate({});
  const { code } = output[0]
  strictEqual(code, `const stylesheet = new CSSStyleSheet();

stylesheet.replace(\`.control{display:flex}\`);

export { stylesheet as default };
`)
})

test('minifies with esbuild', async () => {
  const bundle = await rollup({
    input: 'test/controls.css',
    plugins: [importStylesheet({ minify: { fast: true } })]
  })
  const { output } = await bundle.generate({});
  const { code } = output[0]
  strictEqual(code, `const stylesheet = new CSSStyleSheet();

stylesheet.replace(\`.control{display:flex}
\`);

export { stylesheet as default };
`)
})

test('handles broken input', async () => {
  try {
    await rollup({
      input: 'test/broken.txt',
      plugins: [importStylesheet({ include: ['**/*.txt'] })]
    })
    fail('processed broken input')
  } catch ({ message }) {
    strictEqual(message, ('[plugin import-stylesheet] test/broken.txt (1:1): Unclosed block'))
  }
})

import { createFilter } from '@rollup/pluginutils'
import { resolve } from 'node:path'
import { createProcessor } from 'rollup-copy-transform-css'
import cssToModule from './css-to-module.js'
import handleError from './error.js'

/**
 * CSS rollup plugin
 *
 * @param {Object} opts Options
 * @param {string[]} [opts.include] Pattern to match files which will be processed by the plugin.
 * @param {string[]} [opts.exclude] Pattern to match files which will be ignored by the plugin.
 * @param {Object} [opts.options] Options for the Sass compiler. Use any options supported by the `compileString`
 *  method from the Sass package.
 * @param {boolean|Object} [opts.minify] Enables minifying of the transformed CSS output. If an object is specified, it
 *  will be passed to the cssnano plugin.
 * @param {boolean|Object} [opts.inline] Enables inlining of stylesheets and other assets. If an object is specified,
 *  it will have to include two properties pointing to objects: { stylesheets, assets }. The stylesheets objects will
 *  be passed to the postcss-import plugin. The assets objects will be passed to the postcss-url plugin.
 * @param {Object[]} [opts.plugins] An array of PostCSS plugins to fully customise the transformation of the CSS input.
 * @returns {import('rollup').Plugin}
 */
export function importStylesheet({
  include = ['**/*.css'], exclude, minify, inline, plugins
} = {}) {
  const filter = createFilter(include, exclude)
  if (!(minify || plugins)) {
    inline = true
  }
  const processor = createProcessor({ minify, inline, plugins })

  return {
    name: 'import-stylesheet',

    load(id) {
      if (filter(id)) {
        this.addWatchFile(resolve(id))
      }
    },

    async transform(source, id) {
      if (filter(id)) {
        try {
          const { css } = await processor.process(source, { from: id, map: false })
          return { code: cssToModule(css), map: { mappings: '' } }
        } catch (err) {
          handleError.call(this, err)
        }
      }
    }
  }
}

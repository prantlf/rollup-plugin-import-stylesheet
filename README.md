# rollup-plugin-import-stylesheet

[Rollup] plugin for importing CSS sources as constructible stylesheets.

Faster than the combination of [rollup-plugin-styles] and [rollup-plugin-import-css]. Supports minifying by [cssnano], inlining by [postcss-import] and [postcss-ulrl] or fully customisable transformations of the CSS input by [PostCSS].

## Synopsis

Custom element:

```js
import styles from './styles.css'

document.adoptedStyleSheets.push(styles)
```

Build configuration:

```js
import { importStylesheet } from 'rollup-plugin-import-stylesheet'

export default {
  plugins: [
    importStylesheet({ minify: process.env.NODE_ENV === 'production' })
  ]
  // the rest of the configuration
}
```

## Installation

Make sure that you use [Node.js] 14 or newer and [Rollup] 2 or newer. Use your favourite package manager - [NPM], [PNPM] or [Yarn]:

```sh
npm i -D rollup-plugin-import-stylesheet
pnpm i -D rollup-plugin-import-stylesheet
yarn add -D rollup-plugin-import-stylesheet
```

## Usage

Create a `rollup.config.js` [configuration file] and import the plugin:

```js
import { importStylesheet } from 'rollup-plugin-import-stylesheet'

export default {
  input: 'src/index.js',
  output: { file: 'dist/main.js', format: 'iife', sourcemap: true },
  plugins: [
    importStylesheet({
      minify: process.env.NODE_ENV === 'production',
      inline: { assets: {} }
    })
  ]
}
```

Then call `rollup` either via the [command-line] or [programmatically].

## Options

The following options can be passed in an object to the plugin function to change the default values.

### `include`

Type: `Array<String>`<br>
Default: `['**/*.css']`

[Pattern] to match files which will be processed by the plugin.

### `exclude`

Type: `Array<String>`<br>
Default: `[]`

[Pattern] to match files which will be ignored by the plugin.

### `options`

Type: `Object`<br>
Default: `undefined`

Options for the Sass compiler. Use any [options] supported by the [compileString] method from the Sass package.

### `minify`

Type: `Boolean | Object`<br>
Default: `false`

Enables minifying of the transformed CSS output. If an object is specified, it will be passed to the [cssnano] plugin.

Experimental feature: if the object is set to `{ fast: true }`, [esbuild] will be used instead of [postcss].

### `inline`

Type: `Boolean | Object`<br>
Default: `false`

Enables inlining of stylesheets and other assets. If an object is specified, it will have to include two properties pointing to objects: `{ stylesheets, assets }`. The `stylesheets` objects will be passed to the [postcss-import] plugin. The `assets` objects will be passed to the [postcss-url] plugin.

Experimental feature: if the object is set to `{ fast: true }`, [esbuild] will be used instead of [postcss].

### `plugins`

Type: `Array<Object>`<br>
Default: `undefined`

An array of [PostCSS] plugins to fully customise the transformation of the CSS input.

## How It Works

Let us have a stylesheet called `src/styles.css`:

```css
:host { display: block }
```

And import it for a custom element in `src/index.js`:

```js
import styles from './styles.css'

document.adoptedStyleSheets.push(styles)
```

The stylesheet will be converted to the following script on-the-fly during the build and bundled into `dist/browser.js`:

```js
const stylesheet = new CSSStyleSheet();

stylesheet.replace(`:host { display: block }`);

export { stylesheet as default };
```

### Optimisation

Before converting to the tagged template literal, the CSS output can be optimised by [PostCSS]. The minifying is performed by the [cssnano] plugin. Inlining of other stylesheets imported by the `@import` directives is performed by the [postcss-import] plugin. Inlining of other assets like pictures referred to by absolute or relative URLs is performed by the [postcss-url] plugin. If an error occurs during the transformation, the whole bundling operation will fail, using the [postcss-fail-on-warn] plugin.

Passing a booleans to the `import-stylesheet` plugin - `{ minify: true, inline: true }` - will use the defaults. You can override them by passing an object instead of `true`:

```js
{
  minify: {
    preset: ['default', { discardComments: { removeAll: true } }]
  },
  inline: {
    stylesheets: {},
    assets: { url: 'inline' }
  }
}
```

Pass [options for cssnano] to `minify`, [options for postcss-import] to `inline.stylesheets` and [options for postcss-url] to `inline.assets`.

Experimental feature: if the `minify` or `inline` object is set to `{ fast: true }`, [esbuild] will be used instead of [postcss].

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (C) 2024 Ferdinand Prantl

Licensed under the [MIT License].

[MIT License]: http://en.wikipedia.org/wiki/MIT_License
[Rollup]: https://rollupjs.org/
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[configuration file]: https://www.rollupjs.org/guide/en/#configuration-files
[command-line]: https://www.rollupjs.org/guide/en/#command-line-reference
[programmatically]: https://www.rollupjs.org/guide/en/#javascript-api
[Pattern]: https://www.linuxjournal.com/content/bash-extended-globbing
[PostCSS]: https://postcss.org/
[cssnano]: https://cssnano.co/
[esbuild]: https://esbuild.github.io/
[postcss-import]: https://www.npmjs.com/package/postcss-import
[postcss-url]: https://www.npmjs.com/package/postcss-url
[postcss-fail-on-warn]: https://www.npmjs.com/package/postcss-fail-on-warn
[options supported by PostCSS for source maps]: https://postcss.org/api/#sourcemapoptions
[options for cssnano]: https://cssnano.co/docs/config-file/
[options for postcss-import]: https://github.com/postcss/postcss-import#options
[options for postcss-url]: https://github.com/postcss/postcss-url#options-combinations
[rollup-plugin-styles]: https://www.npmjs.com/package/rollup-plugin-styles
[rollup-plugin-import-css]: https://www.npmjs.com/package/rollup-plugin-import-css

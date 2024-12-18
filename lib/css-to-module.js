import escapeTaggedTemplate from './escape-tag-template.js'

export default function cssToModule(css) {
  return `const stylesheet = new CSSStyleSheet();

stylesheet.replace(\`${escapeTaggedTemplate(css)}\`);

export { stylesheet as default };`
}

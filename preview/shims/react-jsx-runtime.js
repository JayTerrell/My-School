// Automatic JSX runtime on top of the React UMD global.
const R = window.React;
function create(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  if (children === undefined) return R.createElement(type, rest);
  return Array.isArray(children) ? R.createElement(type, rest, ...children) : R.createElement(type, rest, children);
}
module.exports = { jsx: create, jsxs: create, Fragment: R.Fragment };

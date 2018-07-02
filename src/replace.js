module.exports = { replace };
const { parse, getPropDict } = require('./parse-helpers');
function replace(name, code) {
  if (typeof name != 'string') {
    return { error: 'name is required' };
  }
  if (typeof code != 'string') {
    return { error: 'code is required' };
  }
  code = code.trim();
  // test if code is jsx
  if (code[0] != '<') {
    return { error: 'code is not jsx' };
  }
  let tree;
  try {
    tree = parse(code);
  } catch (e) {
    return { error: 'code is invalid jsx' };
  }
  const props = getPropDict(tree);
  let replacement = `
    <${name[0].toUpperCase()}${name.substring(1)}
     ${Object.keys(props)
       .map(p => `${p}=${props[p]}`)
       .join(' ')}  />`
    .replace(/\s+/g, ' ')
    .trim();
  let component = `() => ${code}`;
  return { replacement, component };
}

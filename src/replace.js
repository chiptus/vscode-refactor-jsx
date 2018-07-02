module.exports = { replace };
const { parse } = require('./parse-helpers');
function replace(name, code) {
  if (typeof name != 'string') {
    return { error: 'name is required' };
  }
  if (typeof code != 'string') {
    return { error: 'code is required' };
  }
  const tree = parse(code);
  return { replacement: '', component: '' };
}

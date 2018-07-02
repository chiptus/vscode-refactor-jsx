const { replace } = require('./replace');

describe('gets exactly 2 arguments - 2 strings, otherwise returns an error', () => {
  test('returns error when gets 1 arguments', () => {
    expectError(replace('test'));
  });
});

describe('returns an error if not jsx or invalid jsx', () => {
  test('tests invalid jsx', () => {
    expectError(replace('test', '<div>'));
  });
  test('tests non jsx code', () => {
    expectError(replace('test', "const hello = 'walla'"));
  });
});

describe('returns shape of {replacement, component}', () => {
  const returns = replace(name, `<div />`);
  expect(typeof returns).toBe('object');
  expect(typeof returns.replacement).toBe('string');
  expect(typeof returns.component).toBe('string');
});

describe('tests simple component', () => {
  const code = `
    <div>Hello</div>
  `;
  const name = 'test';
  const expected = {
    replacement: `<Test />`,
    component: `() => <div>Hello</div>`,
  };
  const returns = replace(name, code);
  expect(returns.replacement).toBe(expected.replacement);
  expect(returns.component).toBe(expected.component);
});

function expectError(obj) {
  expect(obj).toHaveProperty('error');
}

console.log(replace(`test`, '<div t={() => t} />'));

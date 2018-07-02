describe("gets exactly 2 arguments - 2 strings, otherwise returns an error", ()=> {
  expectError(replace("test"))
  expectError(replace("test", "hello", "walla"))
})

describe("returns an error if not jsx or invalid jsx", () => {
  expectError(replace("test", '<div>'))
  expectError(replace("test", 'const hello = \'walla\''))
})


describe("returns shape of {replacement, component}", () => {
  const returns = replace(name, `<div />`);
  assertShape(returns, {replacement:string, component: string });
})

describe("tests simple component", () => {
  const code = `
    <div>Hello</div>
  `;
  const name = "test";
  const expected = {
    replacement: `<Test />`,
    component: `() => <div>Hello</div>`
  }
  const returns = replace(name, code);
  assertEqual(expected.replacement, returns.replacement);
  assertEqual(expected.component, returns.component)
})
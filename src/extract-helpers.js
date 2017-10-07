// there should be a basic module that takes a jsx component (ofcourse, checks it's valid jsx) and returns two components:
// 1. the given component with the used variables (renamed if we're using a nested variable inside an ojbect, same if not)
// 2. a new component with props equals to the new variables
module.exports = convert;

const { parse, getImports, getPropNames } = require('./parse-helpers');

function expandImports(imports) {
  return imports.sources
    .map(
      source =>
        `import { ${imports.importsBySource[source]
          .sort()
          .join(', ')} } from "${source}";`
    )
    .join('\n');
}

const componentTemplate = (
  imports,
  componentName,
  vars = [],
  componentCode,
  indentSpaceRegExp,
  singleIndent
) => `import React from "react";
  ${expandImports(imports)}
  export const ${componentName} = (${`{ ${vars.join(', ')} }`}) => (
${componentCode
  .split('\n')
  .map(line => line.replace(indentSpaceRegExp, singleIndent))
  .join('\n')});`;

const replaceTemplate = (indentSpace, componentName, vars) =>
  `${indentSpace}<${componentName} ${vars
    .map(v => `${v}={${v}}`)
    .join(' ')}/>\n`;

function convert(componentCode, fileCode, componentName) {
  const node = parse(componentCode);

  const imports = getImports(node, parse(fileCode));
  const vars = getPropNames(node);
  const lines = componentCode.split('\n');
  const indentSpace = lines[0].match(/^\s*/)[0];
  const indentSpaceRegExp = new RegExp(`^${indentSpace}`);
  const singleIndent = lines[1].replace(indentSpaceRegExp, '').match(/^\s*/)[0];
  const component = componentTemplate(
    imports,
    componentName,
    vars,
    componentCode,
    indentSpaceRegExp,
    singleIndent
  );

  const replaceCode = replaceTemplate(indentSpace, componentName, vars);

  return { component, replaceCode };
}

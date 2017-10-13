const { parse, getImports, getPropNames } = require('./parse-helpers');
const { format } = require('prettier');
// there should be a basic module that takes a jsx component (ofcourse, checks it's valid jsx) and returns two components:
// 1. the given component with the used variables (renamed if we're using a nested variable inside an ojbect, same if not)
// 2. a new component with props equals to the new variables
module.exports = convert;

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
  componentCode
) => {
  const varsString = vars.join(',');

  return format(
    `import React from "react";
    ${expandImports(imports)}

    export const ${componentName} = (${`{${varsString}}`}) => (${componentCode});`
  );
};

const replaceTemplate = (componentName, vars) =>
  format(`<${componentName} ${vars.map(v => `${v}={${v}}`).join(' ')}/>`);

function convert(componentCode, fileCode, componentName) {
  const node = parse(componentCode);

  const imports = getImports(node, parse(fileCode));
  const vars = getPropNames(node);

  const component = componentTemplate(
    imports,
    componentName,
    vars,
    componentCode
  );

  const importLine = `import ${componentName} from './';\n`;

  const replaceCode = replaceTemplate(componentName, vars);

  return { component, replaceCode, importLine };
}

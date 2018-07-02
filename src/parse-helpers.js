const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const types = require('@babel/types');

module.exports = {
  parse,
  getPropDict,
  getImports,
};

function warnAboutUnextractableImport(importName, isVar = false) {
  const detail = [`Couldn't find an import for component '${importName}'.`];
  if (isVar) {
    detail.push("Looks like it's declared in this file?");
  }
  return detail.join('\n');
}

function parse(code) {
  return babylon.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'classProperties',
      'objectRestSpread',
      'functionBind',
    ],
  });
}

function getPropDict(node) {
  let vars = {};
  traverse(node, {
    JSXExpressionContainer(nodePath) {
      const propName = nodePath.parent.name.name;
      vars[propName] = generator(nodePath.node).code;
      nodePath.get('expression').replaceWith(types.identifier(propName));
    },
  });
  return vars;
}

function isUpperCase(s) {
  return s.toUpperCase() === s;
}

function getImportsInNode(node) {
  var imports = [];
  traverse(node, {
    JSXElement: function(nodePath) {
      const { name } = nodePath.node.openingElement.name;
      if (!imports.includes(name) && !isUpperCase(name[0])) {
        return;
      }
      imports.push(name);
    },
  });
  return imports;
}

function getImports(node, fileNode) {
  const imports = getImportsInNode(node);
  var sourcesByImport = {};
  var importsBySource = {};
  var sources = [];
  var importsAsVars = [];
  traverse(fileNode, {
    ImportDeclaration: function(nodePath) {
      imports
        // get the imports w/o sources
        .filter(i => !sourcesByImport[i])
        // for each, see if this import is the source
        .forEach(i => {
          const specifier = nodePath.node.specifiers.find(
            s => s.local.name === i
          );
          if (specifier) {
            const source = nodePath.node.source.value;
            sourcesByImport[i] = source;
            if (!importsBySource[source]) {
              importsBySource[source] = [];
              sources.push(source);
            }
            importsBySource[source].push(i);
          }
        });
    },
    VariableDeclarator: function(nodePath) {
      const name = nodePath.node.id.name;
      if (imports.indexOf(name) >= 0) {
        importsAsVars.push(name);
      }
    },
  });
  imports
    .filter(i => !sourcesByImport[i])
    .forEach(i =>
      warnAboutUnextractableImport(i, importsAsVars.indexOf(i) >= 0)
    );
  return { importsBySource, sources };
}

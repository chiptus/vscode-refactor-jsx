const babylon = require('babylon');
const traverse = require('babel-traverse').default;

module.exports = {
  parse,
  getPropNames,
  getImports,
};

function warnAboutUnextractableImport(importName, isVar = false) {
  const detail = [`Couldn't find an import for component '${importName}'.`];
  if (isVar) {
    detail.push('Looks like its declared in this file?');
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

function getPropNames(node) {
  let vars = [];
  traverse(node, {
    MemberExpression: function(nodePath) {
      //TODO handle `this`
      const { name } = nodePath.node.object;

      if (name && !vars.includes(name)) {
        vars.push(name);
      }
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

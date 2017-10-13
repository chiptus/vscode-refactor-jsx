const vscode = require('vscode');
const { window } = vscode;
const convert = require('./extract-helpers');
module.exports = extractComponent;

function extractComponent() {
  const editor = window.activeTextEditor;
  if (!editor) {
    //no open editor
    return;
  }

  const { selection } = editor;
  const text = editor.document.getText(selection);
  window.showInputBox({ prompt: 'Name of component' }).then(componentName => {
    try {
      const { component, replaceCode, importLine } = convert(
        text,
        editor.document.getText(),
        componentName
      );
      replaceComponent(importLine, replaceCode);
      createNewComponent(component);
    } catch (e) {
      if (e instanceof SyntaxError) {
        window.showErrorMessage('selected JSX is invalid');
      }
    }
  });

  function replaceComponent(importLine, replaceCode) {
    editor.edit(editBuilder => {
      editBuilder.insert(new vscode.Position(0, 0), importLine);
      editBuilder.replace(selection, replaceCode);
    });
  }

  function createNewComponent(component) {
    vscode.workspace
      .openTextDocument({
        language: 'javascript',
        content: component,
      })
      .then(newCompDocument => {
        window.showTextDocument(newCompDocument);
      });
  }
}

extractComponent.dispose = function dispose() {
  console.log('dispose');
};

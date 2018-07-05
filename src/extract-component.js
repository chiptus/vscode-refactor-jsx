const vscode = require('vscode');
const { window } = vscode;
const { replace } = require('refactor-jsx-helpers');
module.exports = extractComponent;

function extractComponent() {
  const editor = window.activeTextEditor;
  if (!editor) {
    //no open editor
    return;
  }

  //TODO create a npm module that gets a file name, a selection (cursor placement + length), and a new component name and outputs {component, replaceCode, importLine}

  const { selection } = editor;
  const selectionText = editor.document.getText(selection);
  window.showInputBox({ prompt: 'Name of component' }).then(componentName => {
    const { component, replacement, error } = replace(
      componentName,
      selectionText
    );
    if (error) {
      window.showErrorMessage(error);
      return;
    }
    // replaceComponent(replacement);
    // createNewComponent(component);
    editor.edit(editBuilder => {
      // editBuilder.insert(new vscode.Position(0, 0), importLine);
      editBuilder.replace(selection, replacement);
      editBuilder.insert(
        new vscode.Position(editor.document.lineCount, 0),
        '\n' + component
      );
    });
  });

  function replaceComponent(replaceCode) {
    editor.edit(editBuilder => {
      // editBuilder.insert(new vscode.Position(0, 0), importLine);
      editBuilder.replace(selection, replaceCode);
    });
  }

  function createNewComponent(component) {
    // const currentFile = window.activeTextEditor.document.uri;
    // // TODO I am in the middle of figure out where to save the file
    // let filePath = vscode.workspace.getWorkspaceFolder(
    //   vscode.Uri.parse('component')
    // );
    // vscode.workspace
    //   .openTextDocument(vscode.Uri.parse('untitled:' + filePath))
    //   .then(newCompDocument => {
    //     window.showTextDocument(newCompDocument);
    //   });
    editor.edit(editBuilder => {
      editBuilder.insert(new vscode.Position(0, 0), component);
    });
  }
}

extractComponent.dispose = function dispose() {
  console.log('dispose');
};

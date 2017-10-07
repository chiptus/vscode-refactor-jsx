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
  try {
    const { component, replaceCode } = convert(
      text,
      editor.document.getText(),
      'NewComponent'
    );
    replaceComponent(replaceCode);
    createNewComponent(component);
  } catch (e) {
    console.log('errot', e);
  }

  function replaceComponent(replaceCode) {
    editor.edit(editBuilder => {
      editBuilder.replace(selection, replaceCode);
    });
  }

  function createNewComponent(component) {
    vscode.workspace
      .openTextDocument(`untitled:~/repos/new-component.js`)
      .then(newCompDocument => {
        window.showTextDocument(newCompDocument).then(newCompEditor => {
          newCompEditor.edit(newCompEditBuilder => {
            newCompEditBuilder.insert(new vscode.Position(0, 0), component);
          });
        });
      });
  }
}

extractComponent.dispose = function dispose() {
  console.log('dispose');
};

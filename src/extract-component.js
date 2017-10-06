const { window } = require('vscode');
module.exports = extractComponent;

function extractComponent() {
  const editor = window.activeTextEditor;
  if (!editor) {
    //no open editor
    return;
  }

  const { selection } = editor;
  const text = editor.document.getText(selection);

  window.showInformationMessage(`Selected chars: ${text.length}`);
}

extractComponent.dispose = function dispose() {
  console.log('dispose');
};

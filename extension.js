/*

https://code.visualstudio.com/docs/extensions/example-word-count
https://code.visualstudio.com/docs/extensionAPI/overview
https://code.visualstudio.com/docs/extensionAPI/extension-points
https://code.visualstudio.com/docs/extensionAPI/activation-events
https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles

*/

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const extractComponent = require('./src/extract-component');
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "refactor-jsx" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.extractJsx',
    extractComponent
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(extractComponent);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;

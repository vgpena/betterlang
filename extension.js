// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const lexicon = require('./lexicon');

function findWords(content) {
	console.log(content);
	const words = Object.keys(lexicon);
	words.forEach((word) => {
		const regexp = new RegExp("\\b(" + word + ")\\b", "gi");
		if (!!content.match(regexp)) {
			console.log(`found: ${word}`);
		}
	})
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jira-hero" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('jira-hero.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('foo from jira-hero!');

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;
		findWords(document.getText())
	});

	// context.subscriptions.push(disposable);

	// const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
	// const git = gitExtension.getAPI(1);
	// console.log(git);

	// context.subscriptions.push(git.onDidChangeOriginalResource(() => {
	// 	console.log('a')
	// }));

	// context.subscriptions.push(vscode.window.onDidChangeActiveTerminal((terminal) => {
	// 	console.log(terminal);
	// }));

	// vscode.scm.

	// context.subscriptions.push(vscode.commands.registerCommand("extension.source-control.checkout", () => console.log('checkout')));

	// context.subscriptions.push(vscode.commands.registerCommand("extension.source-control.open", () => {
	// 	console.log('open');
	// }));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

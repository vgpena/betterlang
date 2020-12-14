// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const lexicon = require('./lexicon');

const decorationType = vscode.window.createTextEditorDecorationType({
	cursor: 'crosshair',
	backgroundColor: '#00acab'
});

function generateMessage(key) {
	const alternatives = lexicon[key];

	// These words should be removed completely.
	if (!alternatives.length) {
		return "This word can be removed."
	}

	return `Instead of **${key}**, consider using ${alternatives.reduce((alternative, acc, index, source) => {
		if (index < source.length - 1) {
			return `${alternative}, ${acc}`;
		}
		return `${alternative}${source.length > 2 ? "," : ""} or ${acc}.`
	})}`;
}

function findWords(document, editor) {
	const content = document.getText();
	const words = Object.keys(lexicon);
	const decorations = [];
	words.forEach((word) => {
		let regexp = new RegExp("\\b(" + word + ")\\b", "gi");
		const matches = content.matchAll(regexp);
		if (!matches) {
			return;
		}
		for (const match of matches) {
			const decoration = { range: new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)), hoverMessage: generateMessage(match[0]) };
			decorations.push(decoration);
			// vscode.window.showQuickPick(lexicon[match[0]]);
		}
	})
	editor.setDecorations(decorationType, decorations)
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
	// let disposable = vscode.commands.registerCommand('jira-hero.helloWorld', function () {
	// 	// The code you place here will be executed every time your command is executed

	let disposable = vscode.commands.registerCommand("jira-hero.foo", (e) => {
		console.log(e)
	});

	// 	// Display a message box to the user
	// 	// vscode.window.showInformationMessage('foo from jira-hero!');

	// 	const editor = vscode.window.activeTextEditor;

	// 	if (!editor) {
	// 		return;
	// 	}

	// 	const document = editor.document;
	// 	findWords(document, editor)
	// });

	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(() => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;
		findWords(document, editor)
	}));

	

	context.subscriptions.push(vscode.languages.registerHoverProvider('markdown', {
		provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);
			// const num = document.get

            if (word === "this") {
				const command = vscode.Uri.parse(`command:jira-hero.foo?${encodeURIComponent(JSON.stringify([{position: document.offsetAt(position)}]))}`)
				const marky = new vscode.MarkdownString(`[clicky](${command})`);
				marky.isTrusted = true;
				return new vscode.Hover(marky);
            }
        }
	}))

	context.subscriptions.push(disposable);

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

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const lexicon = require('./lexicon');

function generateMessage(key) {
	const alternatives = lexicon[key];

	// These words should be removed completely.
	if (!alternatives.length) {
		return "This word can be removed."
	}

	// if (alternatives.length === 1) {
	// 	return `Instead of **${key}**, consider using **${alternatives[0]}**.`
	// }

	// if (alternatives.length === 2) {
	// 	return `Instead of **${key}**, consider using **${alternatives[0]}** or **${alternatives[1]}**.`
	// }

	return `Instead of **${key}**, consider using ${alternatives.reduce((alternative, acc, index, source) => {
		if (index < source.length - 1) {
			return `${alternative}, ${acc}`;
		}
		return `${alternative}${source.length > 2 ? "," : ""} or ${acc}.`
		// if (index === source.length - 1) {
		// 	return `${acc} or **${alternative}**`;
		// }
		// return `${acc}, **${alternative}**`;
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
		console.log(matches);
		for (const match of matches) {
			console.log(match.index);
			const decoration = { range: new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)), hoverMessage: generateMessage(match[0]) };
			decorations.push(decoration);
		}
	})
	// if(!!content.match(regexp)) {
		// let split = content.split(regexp);
		// for(let j = 0, k = split.length; j + 1 < k; j+=2) {
		//   found.push( split[j].substr(-30) + chalk.underline(split[j+1]) + split[j+2].substr(0, 30));
		// }
	// }
	// let match;
	// words.forEach((word) => {
	// while (match = regexp.exec(content)) {
	// 	console.log('a match');
	// 	const start = document.positionAt(match.index);
	// 	const end = document.positionAt(match.index + match[0].length);
	// 	const decoration = { range: new vscode.Range(start, end), hoverMessage: 'Number **' + match[0] + '**' };
	// 	finds.push(decoration);
	// }
	editor.setDecorations(vscode.window.createTextEditorDecorationType({
		cursor: 'crosshair',
		backgroundColor: '#00acab'
	}), decorations)
	// if (!!content.match(regexp)) {
		// console.log(`found: ${word}`);
		
		// finds.push()
	// }
	// })
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
		findWords(document, editor)
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

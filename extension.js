// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const lexicon = require('./lexicon');

const decorationType = vscode.window.createTextEditorDecorationType({
	cursor: 'crosshair',
	backgroundColor: '#00acab'
});

const foundRanges = [];

function generateMessage(matchWord, range) {
	// const alternatives = lexicon[key];

	// // These words should be removed completely.
	// if (!alternatives.length) {
	// 	return "This word can be removed."
	// }

	// return `Instead of **${key}**, consider using ${alternatives.reduce((alternative, acc, index, source) => {
	// 	if (index < source.length - 1) {
	// 		return `${alternative}, ${acc}`;
	// 	}
	// 	return `${alternative}${source.length > 2 ? "," : ""} or ${acc}.`
	// })}`;

	if (!lexicon[matchWord].length) {
		const removeCommand = vscode.Uri.parse(`command:jira-hero.remove?${encodeURIComponent(JSON.stringify([{range: range}]))}`);
		const removeMarkup = new vscode.MarkdownString(`This word can be removed. [Remove?](${removeCommand})`);
		removeMarkup.isTrusted = true;
		return removeMarkup;
	}

	return "foo";


	// THIS NEXT BIT WORKS
	// const command = vscode.Uri.parse(`command:jira-hero.foo?${encodeURIComponent(JSON.stringify([{match: match[0]}]))}`)
	// const marky = new vscode.MarkdownString(`[clicky](${command})`);
	// marky.isTrusted = true;
}

function findWords(document, editor) {
	const content = document.getText();
	const words = Object.keys(lexicon);
	const decorations = [];
	// foundRanges.length = 0;
	words.forEach((word) => {
		let regexp = new RegExp("\\b(" + word + ")\\b", "gi");
		const matches = content.matchAll(regexp);
		if (!matches) {
			return;
		}
		for (const match of matches) {
			const range = new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
			const marky = generateMessage(match[0], range);
			const decoration = { range: range, hoverMessage: marky};
			// foundRanges.push(range);
			decorations.push(decoration);
			// vscode.window.showQuickPick(lexicon[match[0]]);
		}
	})
	editor.setDecorations(decorationType, decorations)
}

function makeRealRange(rangeJSON, removeSpace) {
	const val = removeSpace ? 1 : 0;
	const start = new vscode.Position(rangeJSON[0].line, rangeJSON[0].character - val);
	const end = new vscode.Position(rangeJSON[1].line, rangeJSON[1].character);
	return new vscode.Range(start, end);
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
		// foundRanges.forEach((foundRange) => {
		// 	if (!foundRange.intersection(position)) {
		// 		return;
		// 	}
		// 	console.log(foundRange);
		// })
	});

	let removeDisposable = vscode.commands.registerCommand("jira-hero.remove", (range) => {

		// const r = new vscode.Range
		// const deletion = new vscode.TextEdit()
		// vscode.TextEdit.delete(range);
		// const editor = vscode.window.activeTextEditor;
		// if (!editor) {
		// 	return;
		// }
		// editor
		// editor.edit((editBuilder) => {
		// 	editBuilder.repl
		// })
		const realRange = makeRealRange(range.range, true);
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		editor.edit((editBuilder) => {
			editBuilder.delete(realRange);
		});
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

	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(() => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;
		findWords(document, editor)
	}));

	

	// context.subscriptions.push(vscode.languages.registerHoverProvider('markdown', {
	// 	provideHover(document, position, token) {
	// 		// if (!foundRanges) {
	// 		// 	return;
	// 		// }
	// 		// foundRanges.forEach((foundRange) => {
	// 		// 	if (!foundRange.contains(position)) {
	// 		// 		return;
	// 		// 	}
	// 		// 	const command = vscode.Uri.parse(`command:jira-hero.foo?${encodeURIComponent(JSON.stringify([{position: position}]))}`)
	// 		// 	const marky = new vscode.MarkdownString(`[clicky](${command})`);
	// 		// 	marky.isTrusted = true;
	// 		// 	return new vscode.Hover(marky);
	// 		// })
    //         // const range = document.getWordRangeAtPosition(position);
	// 		// const word = document.getText(range);
	// 		// const num = document.get

    //         // if (word === "this") {
				
    //         // }
    //     }
	// }))

	context.subscriptions.push(disposable);
	context.subscriptions.push(removeDisposable);

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

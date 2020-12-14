// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const lexicon = require("./lexicon");

const decorationType = vscode.window.createTextEditorDecorationType({
  cursor: "crosshair",
  backgroundColor: "#00acab",
});

const foundRanges = [];

function generateMessage(matchWord, range) {
  if (!lexicon[matchWord].length) {
    const removeCommand = vscode.Uri.parse(
      `command:betterlang.remove?${encodeURIComponent(
        JSON.stringify([{ range: range }])
      )}`
    );
    const removeMarkup = new vscode.MarkdownString(
      `This word can be removed. [Remove?](${removeCommand})`
    );
    removeMarkup.isTrusted = true;
    return removeMarkup;
  }

  const preamble = `Instead of **${matchWord}**, consider using:`;
  const replacementsList = lexicon[matchWord].reduce((acc, curr) => {
    const currReplaceCommand = vscode.Uri.parse(
      `command:betterlang.foo?${encodeURIComponent(
        JSON.stringify([{ replacement: curr, range: range }])
      )}`
    );
    return `${acc}\n- [${curr}](${currReplaceCommand})`;
  }, "");
  const marky = new vscode.MarkdownString(`${preamble}${replacementsList}`);
  marky.isTrusted = true;
  return marky;
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
      const range = new vscode.Range(
        document.positionAt(match.index),
        document.positionAt(match.index + match[0].length)
      );
      const marky = generateMessage(match[0], range);
      const decoration = { range: range, hoverMessage: marky };
      decorations.push(decoration);
    }
  });
  editor.setDecorations(decorationType, decorations);
}

function makeRealRange(rangeJSON, removeSpace) {
  const val = removeSpace ? 1 : 0;
  const start = new vscode.Position(
    rangeJSON[0].line,
    rangeJSON[0].character - val
  );
  const end = new vscode.Position(rangeJSON[1].line, rangeJSON[1].character);
  return new vscode.Range(start, end);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand("betterlang.foo", (e) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const realRange = makeRealRange(e.range);
    editor.edit((editBuilder) => {
      editBuilder.replace(realRange, e.replacement);
    });
  });

  let removeDisposable = vscode.commands.registerCommand(
    "betterlang.remove",
    (range) => {
      const realRange = makeRealRange(range.range, true);
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      editor.edit((editBuilder) => {
        editBuilder.delete(realRange);
      });
    }
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const document = editor.document;
      findWords(document, editor);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(() => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const document = editor.document;
      findWords(document, editor);
    })
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(removeDisposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

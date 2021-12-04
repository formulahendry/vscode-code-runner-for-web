// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CodeManager } from './codeManager';
import { CodeView } from './codeView';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "code-runner-for-web" is now active in the web extension host!');

	const codeManager = new CodeManager(context);

	context.subscriptions.push(vscode.commands.registerCommand('code-runner-for-web.run', () => {
		vscode.window.showInformationMessage('Hello World from Code Runner for Web in a web extension host!');
		codeManager.run();
	}));
}

export function deactivate() {}

'use strict';
import * as vscode from 'vscode';

export class CodeView {
    private static panel: vscode.WebviewPanel | undefined;

    public static show(context: vscode.ExtensionContext) {
        if (this.panel) {
            this.panel.webview.html = this.getWebviewContent();
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel("code-runner-for-web", "Code Runner", vscode.ViewColumn.Two, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            this.panel.webview.html = this.getWebviewContent();
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }
    }

    public static run(code: string) {
        if (!this.panel) {
            return;
        }

        this.panel.webview.postMessage({ code });
    }

    protected static getWebviewContent(): string {
        let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js"></script>
            <title>Code Runner</title>
        </head>
        
        <body>
            <input type="text" id="status" value="Initializing..." style="font-size: 25px; margin: 20px 0 5px; padding: 8px; font-weight: bold;" disabled>
            <textarea id="output" style="width: 100%; padding: 8px; font-size: 20px;" rows="30" disabled></textarea>
            <script>
                const status = document.getElementById("status");
                const output = document.getElementById("output");

                let pyodide;

                function setRunStartStatus() {
                    status.value = "Running...";
                    output.value = "";
                }

                function setRunFailureStatus() {
                    status.value = "Code Run has error!";
                    output.style.color = "red";
                }

                function setRunEndStatus() {
                    status.value = "Code Run is done.";
                    output.style.color = "blue";
                }
                
                async function run(code) {
                    if (!pyodide) {
                        pyodide = await loadPyodide({
                            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/"
                        });
                    }
                    setRunStartStatus();
                    await pyodide.runPythonAsync(\`
                                import sys
                                import io
                                sys.stdout = io.StringIO()
                            \`);
                    try {
                        await pyodide.runPythonAsync(code);
                    }
                    catch (error) {
                        output.value = error;
                        setRunFailureStatus();
                        return;
                    }
                    let stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()")
                    output.value = stdout;
                    setRunEndStatus();
                }
        
                // Handle the message inside the webview
                window.addEventListener('message', event => {
        
                    const message = event.data; // The JSON data our extension sent
        
                    run(message.code)
                });
            </script>
        </body>
        
        </html>`;

        return html;
    }
}
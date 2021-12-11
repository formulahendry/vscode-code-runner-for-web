"use strict";
import * as vscode from "vscode";
import { CodeView } from "./codeView";
import { Constants } from "./constants";
import { TelemetryClient } from "./telemetryClient";

export class CodeManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public run() {
        TelemetryClient.sendEvent(Constants.telemetry.event.runStart);

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage(Constants.noFileOpen);
            TelemetryClient.sendEvent(Constants.telemetry.event.runEnd, {
                [Constants.telemetry.isSuccess]: Constants.telemetry.fail,
                [Constants.telemetry.error]: Constants.noFileOpen
            });
            return;
        }

        const document = editor.document;

        if (document.languageId !== "python") {
            vscode.window.showInformationMessage(Constants.notPythonFile);
            TelemetryClient.sendEvent(Constants.telemetry.event.runEnd, {
                [Constants.telemetry.isSuccess]: Constants.telemetry.fail,
                [Constants.telemetry.error]: Constants.notPythonFile
            });
            return;
        }

        CodeView.show(this.context);

        CodeView.run(document.getText());
    }
}
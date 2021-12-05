"use strict";
import * as vscode from "vscode";
import TelemetryReporter from "vscode-extension-telemetry";
import { Constants } from "./constants";

const packageJSON = vscode.extensions.getExtension(Constants.extensionId)!.packageJSON;

export class TelemetryClient {

    public static async sendEvent(eventName: string, properties?: { [key: string]: string; }, measurements?: { [key: string]: number }) {
        this._client.sendTelemetryEvent(eventName, properties, measurements);
    }

    private static _client = new TelemetryReporter(packageJSON.name, packageJSON.version, Constants.aiKey);
}
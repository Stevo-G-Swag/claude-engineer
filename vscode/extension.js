const vscode = require('vscode');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

let recognizer;
let microphone;

function activate(context) {
    console.log('Congratulations, your extension "claude-engineer" is now active!');

    let disposable = vscode.commands.registerCommand('extension.voiceCommandPalette', async function () {
        await initializeSpeechRecognition();
        const command = await voiceInput();
        if (command) {
            processVoiceCommand(command);
        }
    });

    context.subscriptions.push(disposable);
}

async function initializeSpeechRecognition() {
    recognizer = new speech.SpeechClient();
    microphone = await getMicrophone();
}

async function getMicrophone() {
    // Implement microphone access logic here
}

async function voiceInput() {
    return new Promise((resolve, reject) => {
        // Implement voice input logic here using recognizer and microphone
    });
}

function processVoiceCommand(command) {
    const commands = {
        "exit voice mode": () => vscode.window.showInformationMessage("Exiting voice mode."),
        "save chat": () => vscode.window.showInformationMessage("Chat saved."),
        "reset conversation": () => vscode.window.showInformationMessage("Conversation reset.")
    };

    if (commands[command]) {
        commands[command]();
    } else {
        vscode.window.showErrorMessage("Unknown command: " + command);
    }
}

function deactivate() {
    if (microphone) {
        microphone.stop();
    }
}

module.exports = {
    activate,
    deactivate
};
